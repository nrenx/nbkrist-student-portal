import { supabase } from '@/lib/supabase';
import { supabaseConfig } from '@/config/supabase';
import { ProcessedStudentData, PersonalDetailsData, AttendanceData, MidMarksData } from '@/types/student';
import { processMidMarks } from '@/utils/processStudentData';

// Cache for student data to reduce API calls
const dataCache = new Map<string, { data: any, timestamp: number }>();

/**
 * Process multipart form data
 * @param text - The text content of the file
 * @returns Parsed data object or null if parsing fails
 */
function processMultipartData(text: string): Record<string, any> | null {
  try {
    // Check if this is multipart form data
    if (!text.startsWith('--') || !text.includes('Content-Disposition')) {
      return null;
    }

    console.log('Processing multipart form data');

    // Try to extract JSON content
    const jsonStart = text.indexOf('{');
    if (jsonStart >= 0) {
      const jsonEnd = text.lastIndexOf('}');
      if (jsonEnd > jsonStart) {
        // Extract the JSON content
        const jsonContent = text.substring(jsonStart, jsonEnd + 1);

        try {
          // Try to parse the JSON
          const json = JSON.parse(jsonContent);
          console.log('Successfully parsed JSON from multipart form data');
          return json;
        } catch (jsonError) {
          console.log('Error parsing JSON from multipart form data');
        }
      }
    }

    // If JSON parsing failed, try to extract key-value pairs
    const result: Record<string, any> = {};
    const lines = text.split('\n');

    // Find the actual content part (after the headers)
    let contentStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '') {
        contentStartIndex = i + 1;
        break;
      }
    }

    if (contentStartIndex > 0 && contentStartIndex < lines.length) {
      // Extract content lines
      const contentLines = lines.slice(contentStartIndex);
      const content = contentLines.join('\n');

      // Store the raw content
      result.content = content;
    } else {
      // If we couldn't find the content part, store the whole text
      result.content = text;
    }

    return result;
  } catch (error) {
    console.error('Error processing multipart form data:', error);
    return { content: text };
  }
}

/**
 * List files in a directory
 * @param path - Directory path in storage
 * @returns Promise with array of file names or null if error
 */
async function listDirectory(path: string): Promise<string[] | null> {
  try {
    console.log(`Listing directory: ${path}`);
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .list(path);

    if (error) {
      console.error(`Error listing directory ${path}:`, error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log(`No files found in directory ${path}`);
      return [];
    }

    const fileNames = data.map(item => item.name);
    console.log(`Files in directory ${path}:`, fileNames);
    return fileNames;
  } catch (error) {
    console.error(`Error listing directory ${path}:`, error);
    return null;
  }
}

/**
 * Check if a file exists in the bucket
 * @param path - File path in storage
 * @returns Promise<boolean> - True if the file exists, false otherwise
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    console.log(`Checking if file exists: ${path}`);

    // Try to get file metadata
    const { error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .createSignedUrl(path, 1); // Just create a signed URL with minimal expiry to check existence

    if (error) {
      console.log(`File does not exist at ${path}:`, error);
      return false;
    }

    console.log(`File exists at ${path}`);
    return true;
  } catch (error) {
    console.error(`Error checking if file exists at ${path}:`, error);
    return false;
  }
}

/**
 * Interface for roll index entry
 */
interface RollIndexEntry {
  branch: string;
  section: string;
}

/**
 * Interface for roll index file
 */
interface RollIndex {
  [rollNumber: string]: RollIndexEntry;
}

/**
 * Extract branch from roll number pattern
 * @param rollNumber - Student roll number
 * @returns Branch code or null if not found
 */
function extractBranchFromRollNumber(rollNumber: string): string | null {
  console.log(`Attempting to extract branch from roll number: ${rollNumber}`);

  // Common pattern: YYKB1A05XX where YY is year, 05 is branch code
  // Branch codes:
  // 01 - Civil, 02 - EEE, 03 - Mech, 04 - ECE, 05 - CSE, 12 - IT, etc.

  const branchCodeMap: Record<string, string> = {
    '01': 'CIVIL',
    '02': 'EEE',
    '03': 'MECH',
    '04': 'ECE',
    '05': 'CSE',
    '12': 'IT',
    // Add more branch codes as needed
  };

  // Pattern 1: Standard NBKRIST pattern (e.g., 24KB1A0501)
  const match = rollNumber.match(/\d{2}KB1A(\d{2})/);
  console.log(`Standard pattern match result:`, match);

  if (match && match[1]) {
    const branchCode = match[1];
    console.log(`Extracted branch code: ${branchCode}`);
    const branch = branchCodeMap[branchCode] || null;
    console.log(`Mapped branch: ${branch || 'Not found in branch map'}`);
    return branch;
  }

  // Pattern 2: Alternative pattern with just numbers (e.g., 24010501)
  const numericMatch = rollNumber.match(/^\d{2}(\d{2})\d+$/);
  console.log(`Numeric pattern match result:`, numericMatch);

  if (numericMatch && numericMatch[1]) {
    const branchCode = numericMatch[1];
    console.log(`Extracted branch code from numeric pattern: ${branchCode}`);
    const branch = branchCodeMap[branchCode] || null;
    console.log(`Mapped branch from numeric pattern: ${branch || 'Not found in branch map'}`);
    return branch;
  }

  // Pattern 3: Any pattern with two digits that might be a branch code
  const anyMatch = rollNumber.match(/(\d{2})[A-Z0-9]+/);
  console.log(`Any pattern match result:`, anyMatch);

  if (anyMatch && anyMatch[1]) {
    const possibleBranchCode = anyMatch[1];
    console.log(`Possible branch code from any pattern: ${possibleBranchCode}`);
    const branch = branchCodeMap[possibleBranchCode] || null;
    console.log(`Mapped branch from any pattern: ${branch || 'Not found in branch map'}`);
    return branch;
  }

  // Pattern 4: If roll number contains branch name directly
  const branchNames = ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'IT'];
  for (const branch of branchNames) {
    if (rollNumber.includes(branch)) {
      console.log(`Found branch name directly in roll number: ${branch}`);
      return branch;
    }
  }

  console.log('Failed to extract branch from roll number');
  return null;
}

/**
 * Get branch and section for a roll number from rollIndex file
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year
 * @param yearOfStudy - Year of study
 * @returns Promise with branch and section or null if not found
 */
async function getBranchAndSection(
  rollNumber: string,
  academicYear: string,
  yearOfStudy: string
): Promise<{ branch: string, section: string } | null> {
  try {
    console.log(`Getting branch and section for roll number: ${rollNumber}`);
    console.log(`Academic year: ${academicYear}, Year of study: ${yearOfStudy}`);

    // Define possible paths for rollIndex file
    const possibleRollIndexPaths = [
      `${academicYear}/${yearOfStudy}/${supabaseConfig.fileNames.rollIndex}`,
      `student_details/${academicYear}/${yearOfStudy}/${supabaseConfig.fileNames.rollIndex}`,
      `rollIndex/${academicYear}/${yearOfStudy}/${rollNumber}.json`,
      `student_data/rollIndex/${academicYear}/${yearOfStudy}/${rollNumber}.json`,
      `student_details/rollIndex/${academicYear}/${yearOfStudy}/${rollNumber}.json`
    ];

    // Check cache first for each possible path
    if (supabaseConfig.cacheEnabled) {
      const cacheKey = `rollIndex_${academicYear}_${yearOfStudy}`;
      if (dataCache.has(cacheKey)) {
        const cachedData = dataCache.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < supabaseConfig.cacheDuration) {
          console.log('Using cached rollIndex data');
          const rollIndex = cachedData.data as RollIndex;
          if (rollIndex[rollNumber]) {
            console.log(`Found roll number in cached index: ${JSON.stringify(rollIndex[rollNumber])}`);
            return rollIndex[rollNumber];
          }
        }
      }
    }

    // Try each possible path for rollIndex
    for (const rollIndexPath of possibleRollIndexPaths) {
      console.log(`Trying rollIndex path: ${rollIndexPath}`);

      // Try to download the rollIndex file
      const rollIndexData = await downloadFile(rollIndexPath);

      if (rollIndexData) {
        console.log(`Found data at ${rollIndexPath}`);

        // If this is a specific roll number file, it might contain branch and section directly
        if (rollIndexPath.includes(rollNumber)) {
          console.log('This is a roll-specific index file');

          // Extract branch and section from the data
          const branch = rollIndexData.branch || null;
          const section = rollIndexData.section || null;

          if (branch && section) {
            console.log(`Found branch: ${branch}, section: ${section} in roll-specific index`);
            return { branch, section };
          }

          // If the data has a content field, try to extract branch and section from it
          if (rollIndexData.content) {
            const content = rollIndexData.content;
            console.log(`Trying to extract from content: ${content}`);

            // Try different patterns to extract branch and section
            if (typeof content === 'string') {
              if (content.includes('branch') && content.includes('section')) {
                // Pattern: "branch:XXX,section:YYY"
                const parts = content.split(',');
                let extractedBranch = null;
                let extractedSection = null;

                for (const part of parts) {
                  if (part.includes(':')) {
                    const [key, value] = part.split(':', 2);
                    if (key.trim().toLowerCase() === 'branch') {
                      extractedBranch = value.trim();
                    } else if (key.trim().toLowerCase() === 'section') {
                      extractedSection = value.trim();
                    }
                  }
                }

                if (extractedBranch && extractedSection) {
                  console.log(`Extracted branch: ${extractedBranch}, section: ${extractedSection} from content`);
                  return { branch: extractedBranch, section: extractedSection };
                }
              }
            }
          }
        } else {
          // This is a general rollIndex file, check if it has the roll number as a key
          if (rollIndexData[rollNumber]) {
            console.log(`Found roll number in index: ${JSON.stringify(rollIndexData[rollNumber])}`);
            return rollIndexData[rollNumber];
          }
        }
      }
    }

    // If rollIndex approach failed, try to extract branch from roll number pattern
    const branch = extractBranchFromRollNumber(rollNumber);
    if (branch) {
      // Default to section A if we can't determine it
      console.log(`Extracted branch ${branch} from roll number pattern, defaulting to section A`);
      return { branch, section: 'A' };
    }

    // If all approaches failed, use a default branch and section as last resort
    console.log('Could not determine branch and section, using CSE/A as default');
    return { branch: 'CSE', section: 'A' };
  } catch (error) {
    console.error('Error getting branch and section:', error);
    return null;
  }
}

/**
 * Download a file from Supabase Storage
 * @param path - File path in storage
 * @returns Promise with file content or null if not found
 */
async function downloadFile(path: string): Promise<any | null> {
  // Check cache first
  if (supabaseConfig.cacheEnabled && dataCache.has(path)) {
    const cachedData = dataCache.get(path);
    if (cachedData && Date.now() - cachedData.timestamp < supabaseConfig.cacheDuration) {
      console.log(`Using cached data for ${path}`);
      return cachedData.data;
    }
  }

  try {
    console.log(`Attempting to download file from path: ${path}`);
    console.log(`Full storage path: ${supabaseConfig.storageBucket}/${path}`);

    // Try to get a signed URL first to check if the file exists
    try {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(supabaseConfig.storageBucket)
        .createSignedUrl(path, 60);

      if (signedUrlError) {
        console.log(`Could not create signed URL for ${path}:`, signedUrlError);
      } else if (signedUrlData) {
        console.log(`File exists at ${path}, signed URL created`);
      }
    } catch (signedUrlError) {
      console.log(`Error creating signed URL for ${path}:`, signedUrlError);
    }

    // Try to download the file
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .download(path);

    if (error) {
      console.error(`File not found at ${path}:`, error);
      console.log(`Error message: ${error.message}`);
      return null;
    }

    if (!data) {
      console.log(`No data returned for ${path}`);
      return null;
    }

    // Get the file content as text
    const text = await data.text();
    console.log(`File content length: ${text.length} characters`);

    // Log a preview of the content for debugging
    if (text.length > 0) {
      console.log(`Content preview: ${text.substring(0, Math.min(100, text.length))}...`);
    }

    let parsedData: any;

    // Try multiple parsing strategies
    try {
      // Strategy 1: Parse as JSON
      parsedData = JSON.parse(text);
      console.log(`Successfully parsed as JSON: ${path}`);
    } catch (jsonError) {
      console.log(`JSON parsing failed for ${path}, trying multipart form data`);

      // Strategy 2: Parse as multipart form data
      parsedData = processMultipartData(text);

      if (parsedData && Object.keys(parsedData).length > 0) {
        console.log(`Successfully parsed as multipart form data: ${path}`);
      } else {
        console.log(`Multipart parsing failed for ${path}, trying key-value extraction`);

        // Strategy 3: Try to extract key-value pairs from the content
        try {
          const lines = text.split('\n');
          const extractedData: Record<string, string> = {};

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // Try to extract key-value pairs
            if (trimmedLine.includes(':')) {
              const [key, value] = trimmedLine.split(':', 2);
              if (key && value) {
                extractedData[key.trim()] = value.trim();
              }
            } else if (trimmedLine.includes('=')) {
              const [key, value] = trimmedLine.split('=', 2);
              if (key && value) {
                extractedData[key.trim()] = value.trim();
              }
            }
          }

          if (Object.keys(extractedData).length > 0) {
            parsedData = extractedData;
            console.log(`Successfully extracted ${Object.keys(extractedData).length} key-value pairs from ${path}`);
          } else {
            // Strategy 4: Just return the raw text as content
            parsedData = { content: text };
            console.log(`Returning raw text as content for ${path}`);
          }
        } catch (extractError) {
          console.error(`Error extracting key-value pairs from ${path}:`, extractError);
          parsedData = { content: text };
        }
      }
    }

    // Cache the data
    if (supabaseConfig.cacheEnabled) {
      dataCache.set(path, { data: parsedData, timestamp: Date.now() });
      console.log(`Cached data for ${path}`);
    }

    return parsedData;
  } catch (error) {
    console.error(`Error downloading file from ${path}:`, error);
    return null;
  }
}

/**
 * Get possible file paths for a student
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year
 * @param yearSem - Year and semester (e.g., "1-1")
 * @returns Promise with array of possible paths
 */
async function getPossiblePaths(
  rollNumber: string,
  academicYear: string,
  yearSem: string
): Promise<string[]> {
  console.log(`Getting possible paths for: ${rollNumber}, ${academicYear}, ${yearSem}`);

  // Extract year of study from yearSem (e.g., "1-1" -> "1")
  const yearOfStudy = yearSem.split('-')[0];
  console.log(`Extracted year of study: ${yearOfStudy}`);

  // Get branch and section information
  console.log(`Calling getBranchAndSection for ${rollNumber}`);
  const branchSectionInfo = await getBranchAndSection(rollNumber, academicYear, yearOfStudy);
  console.log(`Branch and section info result:`, branchSectionInfo);

  // Initialize array of possible paths
  const possiblePaths: string[] = [];

  // Step 1: Try rollIndex paths first (EXACT paths from the logs)
  const rollIndexPaths = [
    `rollIndex/${academicYear}/${yearSem}/${rollNumber}.json`,
    `student_data/rollIndex/${academicYear}/${yearSem}/${rollNumber}.json`,
    `rollIndex/${academicYear}/${yearOfStudy}/${rollNumber}.json`,
    `student_data/rollIndex/${academicYear}/${yearOfStudy}/${rollNumber}.json`
  ];

  for (const path of rollIndexPaths) {
    console.log(`Adding rollIndex path: ${path}`);
    possiblePaths.push(path);
  }

  // Step 2: If we have branch and section info, add those paths
  if (branchSectionInfo) {
    const { branch, section } = branchSectionInfo;
    console.log(`Using branch: ${branch}, section: ${section}`);

    // These are the EXACT paths from the logs
    const exactPaths = [
      `${academicYear}/${yearSem}/${branch}/${section}/${rollNumber}`,
      `student_data/${academicYear}/${yearSem}/${branch}/${section}/${rollNumber}`,
      `${academicYear}/${yearOfStudy}/${branch}/${section}/${rollNumber}`,
      `student_data/${academicYear}/${yearOfStudy}/${branch}/${section}/${rollNumber}`
    ];

    for (const path of exactPaths) {
      console.log(`Adding exact path: ${path}`);
      possiblePaths.push(path);
    }
  }

  // Step 3: Always try fallback paths with common branches and sections
  console.log('Adding fallback paths with common branches and sections');
  const commonBranches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AI_DS'];
  const commonSections = ['A', 'B', 'C', 'D', '-'];

  for (const branch of commonBranches) {
    for (const section of commonSections) {
      // These are the EXACT paths from the logs
      const paths = [
        `${academicYear}/${yearSem}/${branch}/${section}/${rollNumber}`,
        `student_data/${academicYear}/${yearSem}/${branch}/${section}/${rollNumber}`,
        `${academicYear}/${yearOfStudy}/${branch}/${section}/${rollNumber}`,
        `student_data/${academicYear}/${yearOfStudy}/${branch}/${section}/${rollNumber}`
      ];

      for (const path of paths) {
        if (!possiblePaths.includes(path)) {
          possiblePaths.push(path);
        }
      }
    }
  }

  // Step 4: Also try direct paths without branch/section
  const directPaths = [
    `${academicYear}/${yearSem}/${rollNumber}`,
    `student_data/${academicYear}/${yearSem}/${rollNumber}`,
    `${academicYear}/${yearOfStudy}/${rollNumber}`,
    `student_data/${academicYear}/${yearOfStudy}/${rollNumber}`
  ];

  for (const path of directPaths) {
    if (!possiblePaths.includes(path)) {
      possiblePaths.push(path);
    }
  }

  console.log(`Generated ${possiblePaths.length} possible paths`);
  return possiblePaths;
}

/**
 * Fetch student details from Supabase Storage
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year (e.g., "2023-24")
 * @param yearSem - Year and semester (e.g., "1-1")
 * @returns Promise with processed student data or null if not found
 */
export async function fetchStudentDetailsFromStorage(
  rollNumber: string,
  academicYear: string,
  yearSem: string
): Promise<ProcessedStudentData | null> {
  try {
    // Ensure roll number is uppercase
    const uppercaseRollNumber = rollNumber.toUpperCase();
    console.log('Query parameters:', { rollNumber: uppercaseRollNumber, academicYear, yearSem });
    console.log('Storage bucket:', supabaseConfig.storageBucket);

    // Check if bucket exists by trying to list files
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage
        .from(supabaseConfig.storageBucket)
        .list();

      if (bucketError) {
        console.error('Error accessing bucket:', bucketError);
        console.log('Bucket may not exist or is not accessible');
      } else {
        console.log('Bucket is accessible, found items:', bucketData?.length || 0);

        // Log the items in the root directory
        if (bucketData && bucketData.length > 0) {
          console.log('Items in root directory:', bucketData.map(item => item.name));
        }
      }
    } catch (bucketCheckError) {
      console.error('Error checking bucket:', bucketCheckError);
    }

    // Continue with data fetching regardless of bucket check result
    // The actual file operations will fail if the bucket doesn't exist

    // List root directory to see what's available
    console.log('Listing root directory of bucket:');
    await listDirectory('');

    // Try to list the academic year directory
    console.log(`Listing academic year directory: ${academicYear}`);
    await listDirectory(academicYear);

    // Also try to list the student_details directory
    console.log('Listing student_details directory:');
    await listDirectory('student_details');

    // Also try to list the student_data directory
    console.log('Listing student_data directory:');
    await listDirectory('student_data');

    // Initialize data structure (exactly like the Python implementation)
    const data = {
      rollNumber: uppercaseRollNumber,
      academicYear,
      yearSem,
      branch: null as string | null,
      section: null as string | null,
      personalDetails: null as PersonalDetailsData | null,
      attendance: null as AttendanceData | null,
      midMarks: null as MidMarksData | null,
      attendancePercentage: 'N/A',
      totalClasses: 'N/A',
      processedMidMarks: null
    };

    // Get possible paths for this student
    const possiblePaths = await getPossiblePaths(uppercaseRollNumber, academicYear, yearSem);
    console.log('Possible paths:', possiblePaths);

    if (possiblePaths.length === 0) {
      console.error('No possible paths found for student data');
      return null;
    }

    // Step 1: Check for rollIndex files first
    let rollIndexData = null;
    for (const path of possiblePaths) {
      if (path.includes('rollIndex') && path.endsWith('.json')) {
        console.log(`Checking rollIndex at: ${path}`);
        const result = await downloadFile(path);
        if (result) {
          rollIndexData = result;
          console.log(`Found rollIndex at: ${path}`, rollIndexData);
          break;
        }
      }
    }

    // Step 2: Extract branch and section from rollIndex if found
    if (rollIndexData) {
      // Extract branch and section from rollIndex
      let branch = rollIndexData.branch;
      let section = rollIndexData.section;

      // If branch and section are not found, try to extract them from the content
      if (!branch || !section) {
        if ('content' in rollIndexData) {
          const content = rollIndexData.content;
          console.log(`Trying to extract branch and section from content: ${content}`);

          // Try different patterns to extract branch and section
          if (typeof content === 'string') {
            // Pattern 1: "branch:XXX,section:YYY"
            if (content.toLowerCase().includes('branch') && content.toLowerCase().includes('section')) {
              const parts = content.split(',');
              for (const part of parts) {
                if (part.includes(':')) {
                  const [key, value] = part.split(':', 2);
                  const keyLower = key.trim().toLowerCase();
                  const valueStr = value.trim();
                  if (keyLower === 'branch') {
                    branch = valueStr;
                  } else if (keyLower === 'section') {
                    section = valueStr;
                  }
                }
              }
            }
            // Pattern 2: Just the branch and section separated by comma or space
            else if (content.includes(',')) {
              const parts = content.split(',');
              if (parts.length >= 2) {
                branch = parts[0].trim();
                section = parts[1].trim();
              }
            } else if (content.includes(' ')) {
              const parts = content.split(' ');
              if (parts.length >= 2) {
                branch = parts[0].trim();
                section = parts[1].trim();
              }
            }
            // Pattern 3: Just the branch name (common case)
            else if (['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'IT'].includes(content.trim().toUpperCase())) {
              branch = content.trim().toUpperCase();
              section = 'A'; // Default section
            }
          }
        }
      }

      // If we found branch and section, update the data
      if (branch && section) {
        console.log(`Using branch: ${branch}, section: ${section} from rollIndex`);
        data.branch = branch;
        data.section = section;
      }
    }

    // Step 3: If we still don't have branch and section, try to extract from roll number
    if (!data.branch || !data.section) {
      const extractedBranch = extractBranchFromRollNumber(uppercaseRollNumber);
      if (extractedBranch) {
        data.branch = extractedBranch;
        data.section = 'A'; // Default section
        console.log(`Using extracted branch: ${extractedBranch} from roll number pattern`);
      } else {
        // Default values as last resort
        data.branch = 'CSE';
        data.section = 'A';
        console.log('Using default branch: CSE, section: A');
      }
    }

    // Step 4: Now try to find the student data files
    let foundAnyData = false;

    // Filter out rollIndex paths and keep only directory paths
    const directoryPaths = possiblePaths.filter(path =>
      !path.includes('rollIndex') && !path.endsWith('.json')
    );

    // Try each base path
    for (const basePath of directoryPaths) {
      console.log(`Checking base path: ${basePath}`);

      // Try different file name variations (EXACT file names from the logs)
      const personalDetailsFileNames = [
        'personal_details.json'
      ];

      const attendanceFileNames = [
        'attendance.json'
      ];

      const midMarksFileNames = [
        'mid_marks.json'
      ];

      // Check for personal details
      for (const fileName of personalDetailsFileNames) {
        const path = `${basePath}/${fileName}`;
        console.log(`Checking for personal details at: ${path}`);
        const personalDetails = await downloadFile(path) as PersonalDetailsData;
        if (personalDetails) {
          console.log(`Found personal details at: ${path}`);
          data.personalDetails = personalDetails;
          foundAnyData = true;

          // If we don't have branch/section yet, try to extract from personal details
          if (!data.branch || !data.section) {
            data.branch = personalDetails.branch || personalDetails.Branch || data.branch;
            data.section = personalDetails.section || personalDetails.Section || data.section;
          }

          break;
        }
      }

      // Check for attendance
      for (const fileName of attendanceFileNames) {
        const path = `${basePath}/${fileName}`;
        console.log(`Checking for attendance at: ${path}`);
        const attendance = await downloadFile(path) as AttendanceData;
        if (attendance) {
          console.log(`Found attendance at: ${path}`);
          data.attendance = attendance;
          foundAnyData = true;
          break;
        }
      }

      // Check for mid marks
      for (const fileName of midMarksFileNames) {
        const path = `${basePath}/${fileName}`;
        console.log(`Checking for mid marks at: ${path}`);
        const midMarks = await downloadFile(path) as MidMarksData;
        if (midMarks) {
          console.log(`Found mid marks at: ${path}`);
          data.midMarks = midMarks;
          foundAnyData = true;
          break;
        }
      }

      // If we found any data, we can stop searching
      if (foundAnyData) {
        console.log(`Found data at base path: ${basePath}`);
        break;
      }
    }

    // If we didn't find any data, return null
    if (!foundAnyData) {
      console.error('No student data found');
      return null;
    }

    // If we only have attendance or mid marks but no personal details,
    // create a minimal personal details object
    if (!data.personalDetails && (data.attendance || data.midMarks)) {
      console.log('Creating minimal personal details for student with partial data');
      data.personalDetails = {
        Name: data.rollNumber,
        'Roll No': data.rollNumber
      };
    }

    // Calculate attendance percentage and total classes
    if (data.attendance) {
      // Try different property names for attendance percentage
      data.attendancePercentage = data.attendance.attendance_percentage ||
                                data.attendance.attendancePercentage ||
                                data.attendance['Attendance Percentage'] ||
                                data.attendance['attendance percentage'] ||
                                'N/A';

      // Try different property names for total classes
      data.totalClasses = data.attendance.total_classes ||
                        data.attendance.totalClasses ||
                        data.attendance['Total Classes'] ||
                        data.attendance['total classes'] ||
                        'N/A';
    }

    // Process mid marks
    if (data.midMarks) {
      data.processedMidMarks = processMidMarks(data.midMarks);
    }

    console.log('Successfully retrieved data for student', data.rollNumber);
    return data as ProcessedStudentData;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    throw err;
  }
}
