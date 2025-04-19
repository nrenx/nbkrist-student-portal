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
 * Check if a directory exists in the bucket
 * @param path - Directory path in storage
 * @returns Promise<boolean> - True if the directory exists, false otherwise
 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    console.log(`Checking if directory exists: ${path}`);

    // Try to list the directory
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .list(path);

    if (error) {
      console.log(`Directory does not exist at ${path}:`, error);
      return false;
    }

    console.log(`Directory exists at ${path}, contains ${data?.length || 0} items`);
    return true;
  } catch (error) {
    console.error(`Error checking if directory exists at ${path}:`, error);
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
 * Get student data path
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year
 * @param yearSem - Year and semester (e.g., "1-1")
 * @returns The path to the student data folder
 */
function getStudentDataPath(
  rollNumber: string,
  academicYear: string,
  yearSem: string
): string {
  console.log(`Getting student data path for: ${rollNumber}, ${academicYear}, ${yearSem}`);

  // Use the full yearSem value (e.g., "1-1", "3-2", etc.)
  console.log(`Using full year-semester format: ${yearSem}`);

  // Use the storage structure matching the Supabase bucket
  // Based on the screenshot: 2024-25/1-1/24KB1A0501/
  const path = `${academicYear}/${yearSem}/${rollNumber}`;
  console.log(`Student data path: ${path}`);

  return path;
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

    // Get the student data path using the full yearSem format (e.g., "3-1")
    const studentPath = getStudentDataPath(uppercaseRollNumber, academicYear, yearSem);
    console.log(`Student data path: ${studentPath}`);

    // Check if the student folder exists
    console.log(`Checking if folder exists: ${studentPath}`);
    const folderExists = await directoryExists(studentPath);
    console.log(`Folder exists check result: ${folderExists}`);

    if (!folderExists) {
      console.error(`Student folder not found at ${studentPath}`);

      // Try to list the parent directories to see what's available
      console.log(`Listing parent directories to debug:`);
      const academicYearPath = academicYear;
      console.log(`Checking academic year directory: ${academicYearPath}`);
      await listDirectory(academicYearPath);

      const yearSemPath = `${academicYear}/${yearSem}`;
      console.log(`Checking year-semester directory: ${yearSemPath}`);
      await listDirectory(yearSemPath);

      return null; // Return "No data available" if the folder doesn't exist
    }

    console.log(`Student folder found at ${studentPath}, proceeding to fetch data files`);

    // List the contents of the student folder to see what files are available
    console.log(`Listing contents of student folder:`);
    await listDirectory(studentPath);

    // Initialize data structure
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

    // Download personal_details.json
    const personalDetailsPath = `${studentPath}/${supabaseConfig.fileNames.personalDetails}`;
    console.log(`Checking for personal details at: ${personalDetailsPath}`);
    const personalDetails = await downloadFile(personalDetailsPath) as PersonalDetailsData;
    if (personalDetails) {
      console.log(`Found personal details`);
      data.personalDetails = personalDetails;

      // Try to extract branch/section from personal details if available
      data.branch = personalDetails.branch || personalDetails.Branch || data.branch;
      data.section = personalDetails.section || personalDetails.Section || data.section;
    }

    // Download attendance.json
    const attendancePath = `${studentPath}/${supabaseConfig.fileNames.attendance}`;
    console.log(`Checking for attendance at: ${attendancePath}`);
    const attendance = await downloadFile(attendancePath) as AttendanceData;
    if (attendance) {
      console.log(`Found attendance data`);
      data.attendance = attendance;

      // Calculate attendance percentage and total classes
      data.attendancePercentage = attendance.attendance_percentage ||
                                attendance.attendancePercentage ||
                                attendance['Attendance Percentage'] ||
                                attendance['attendance percentage'] ||
                                'N/A';

      data.totalClasses = attendance.total_classes ||
                        attendance.totalClasses ||
                        attendance['Total Classes'] ||
                        attendance['total classes'] ||
                        'N/A';
    }

    // Download mid_marks.json
    const midMarksPath = `${studentPath}/${supabaseConfig.fileNames.midMarks}`;
    console.log(`Checking for mid marks at: ${midMarksPath}`);
    const midMarks = await downloadFile(midMarksPath) as MidMarksData;
    if (midMarks) {
      console.log(`Found mid marks data`);
      data.midMarks = midMarks;
      data.processedMidMarks = processMidMarks(midMarks);
    }

    // Download roll number info file (named after the roll number itself)
    const rollNumberInfoFileName = supabaseConfig.fileNames.getRollNumberInfoFileName(uppercaseRollNumber);
    const rollNumberInfoPath = `${studentPath}/${rollNumberInfoFileName}`;
    console.log(`Checking for roll number info at: ${rollNumberInfoPath}`);
    const rollNumberInfo = await downloadFile(rollNumberInfoPath);
    if (rollNumberInfo) {
      console.log(`Found roll number info:`, rollNumberInfo);
      // Only update branch and section if they're not already set from personal details
      data.branch = data.branch || rollNumberInfo.branch || null;
      data.section = data.section || rollNumberInfo.section || null;
    } else {
      console.log(`Roll number info file not found at: ${rollNumberInfoPath}`);
    }

    // If we didn't find any data files, return null
    if (!data.personalDetails && !data.attendance && !data.midMarks) {
      console.error('No student data files found in the folder');
      return null; // Return "No data available"
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

    console.log('Successfully retrieved data for student', data.rollNumber);
    return data as ProcessedStudentData;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    throw err;
  }
}
