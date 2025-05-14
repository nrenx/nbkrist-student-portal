import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { PersonalDetails, SearchParams, SearchResult } from '@/types/student';
import { toast } from '@/components/ui/use-toast';
import { searchCache } from '@/lib/cache';
import {
  listRollNumbers,
  getSignedUrl
} from '@/lib/supabaseUtils';

// Constants
const BATCH_SIZE = 100; // Increased batch size for better performance
const MAX_RESULTS = 100;

/**
 * Normalize student data to ensure consistent field names
 * @param data The raw data from the JSON file
 * @param rollNumber The roll number of the student
 * @returns Normalized student data with consistent field names
 */
function normalizeStudentData(data: any, rollNumber: string): PersonalDetails {
  // Create a new object with normalized fields
  const normalized: PersonalDetails = {
    rollNumber: rollNumber,
    // Handle both lowercase and capitalized field names
    name: data.name || data.Name || '',
    fatherName: data.fatherName || data['Father Name'] || '',
    parentMobile: data.parentMobile || data['Parent Mobile'] || '',
    studentMobile: data.studentMobile || data['Student Mobile'] || '',
    aadhaar: data.aadhaar || data.Aadhaar || '',
    extractedAt: data.extractedAt || data.extracted_at || '',
  };

  // Copy all original fields as well
  return { ...data, ...normalized };
}

/**
 * Custom hook for searching students by name
 */
export default function useStudentSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Abort the current search if one is in progress
   */
  const abortSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  /**
   * Search for students by name
   * @param params Search parameters including namePrefix, academicYear, and yearOfStudy
   */
  const searchStudents = async (params: SearchParams) => {
    const { academicYear, yearOfStudy, namePrefix } = params;

    // Clear previous results and errors
    setResults([]);
    setError(null);
    setLoading(true);
    setProgress(0);
    setHasSearched(true);

    // Abort any previous search
    abortSearch();

    // Create an abort controller for this search
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log(`Searching for students with name containing: ${namePrefix} in ${academicYear}/${yearOfStudy}`);

      // Check if we have cached results for this search
      const cachedResults = searchCache.get(academicYear, yearOfStudy, namePrefix);
      if (cachedResults) {
        console.log(`Using cached results for ${academicYear}/${yearOfStudy}/${namePrefix}`);
        setResults(cachedResults);
        setLoading(false);
        toast({
          title: "Search completed",
          description: `Found ${cachedResults.length} matching students (from cache).`,
        });
        return;
      }

      // Get the roll number folders in the specified path using our utility function
      const rollNumbersResult = await listRollNumbers(academicYear, yearOfStudy);

      if (!rollNumbersResult.success) {
        throw new Error(`Could not access ${academicYear}/${yearOfStudy}: ${rollNumbersResult.error}`);
      }

      if (!rollNumbersResult.rollNumbers || rollNumbersResult.rollNumbers.length === 0) {
        throw new Error(`No student data found for ${academicYear}/${yearOfStudy}`);
      }

      // Use these roll numbers for our search
      const allFolders = rollNumbersResult.rollNumbers.map(name => ({ name }));

      if (allFolders.length === 0) {
        setError(`No student data found for ${academicYear}/${yearOfStudy}`);
        setLoading(false);
        return;
      }

      // Process folders in batches to avoid overwhelming the browser
      const validResults: SearchResult[] = [];
      const totalFolders = allFolders.length;

      // Process folders in batches
      for (let i = 0; i < totalFolders; i += BATCH_SIZE) {
        if (signal.aborted) {
          throw new Error('Search aborted');
        }

        // Update progress
        setProgress(Math.floor((i / totalFolders) * 100));

        // Get the current batch of folders
        const folderBatch = allFolders.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(totalFolders / BATCH_SIZE)}, size: ${folderBatch.length}`);

        // Process this batch in parallel
        const batchPromises = folderBatch.map(async (folder) => {
          const rollNumber = folder.name;

          // Use the original path structure for better performance
          const filePath = `${academicYear}/${yearOfStudy}/${rollNumber}/personal_details.json`;

          try {
            // Get a signed URL for the personal_details.json file
            let signedUrlResult = await getSignedUrl(filePath, 60);

            if (!signedUrlResult.success || !signedUrlResult.signedUrl) {
              // If we can't get a signed URL, it probably means the file doesn't exist
              return null;
            }

            // Fetch the file using the signed URL
            try {
              const response = await fetch(signedUrlResult.signedUrl);

              if (!response.ok) {
                return null;
              }

              // Parse the JSON data
              const text = await response.text();

              try {
                const personalDetails = JSON.parse(text);

                // Normalize the data to ensure consistent field names
                const normalizedData = normalizeStudentData(personalDetails, rollNumber);

                // Check if name contains the search term (case insensitive)
                const studentName = normalizedData.name || '';

                if (studentName && studentName.toLowerCase().includes(namePrefix.toLowerCase())) {
                  return {
                    data: normalizedData,
                    rollNumber
                  } as SearchResult;
                }

                // Name doesn't contain the search term
                return null;
              } catch (parseError) {
                return null;
              }
            } catch (err) {
              return null;
            }
          } catch (err) {
            return null;
          }
        });

        // Wait for all promises in this batch
        const batchResults = await Promise.all(batchPromises);

        // Filter out null results and add valid ones to our collection
        const validBatchResults = batchResults.filter(result => result !== null) as SearchResult[];
        validResults.push(...validBatchResults);

        // If we've found enough results, we can stop processing
        if (validResults.length >= MAX_RESULTS) {
          console.log(`Found ${validResults.length} results, stopping search`);
          break;
        }
      }

      // Set progress to 100% when done
      setProgress(100);

      if (validResults.length === 0) {
        setError(`No students found with names containing "${namePrefix}"`);
      } else {
        // Sort results alphabetically by name
        validResults.sort((a, b) => {
          const nameA = (a.data?.name || '').toLowerCase();
          const nameB = (b.data?.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });

        // Limit the number of results if necessary
        const limitedResults = validResults.slice(0, MAX_RESULTS);

        // Cache the results for future searches
        searchCache.set(academicYear, yearOfStudy, namePrefix, limitedResults);

        setResults(limitedResults);
        setLoading(false);

        toast({
          title: "Search completed",
          description: `Found ${limitedResults.length} matching students${validResults.length > MAX_RESULTS ? ` (showing first ${MAX_RESULTS})` : ''}.`,
        });
        return;
      }
    } catch (err) {
      // Don't show error for aborted searches
      if (err instanceof Error && err.message === 'Search aborted') {
        console.log('Search was aborted');
        return;
      }

      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  };

  const cancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      setProgress(0);
    }
  };

  return {
    searchStudents,
    cancelSearch,
    results,
    loading,
    error,
    progress,
    hasSearched
  };
}
