import { ProcessedStudentData } from '@/types/student';
import { fetchStudentDetailsFromStorage } from './studentStorageService';

/**
 * Fetch student details from Supabase
 * This function now uses the storage-based implementation
 *
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year (e.g., "2023-24")
 * @param yearSem - Year and semester code (e.g., "1-1" for First Yr - First Sem)
 * @returns Processed student data or null if not found
 */
export async function fetchStudentDetails(
  rollNumber: string,
  academicYear: string,
  yearSem: string
): Promise<ProcessedStudentData | null> {
  try {
    console.log('Fetching student details from storage:', { rollNumber, academicYear, yearSem });

    // Add a timestamp for performance tracking
    const startTime = Date.now();

    // Use the new storage-based implementation
    const result = await fetchStudentDetailsFromStorage(rollNumber, academicYear, yearSem);

    // Log the time taken
    const endTime = Date.now();
    console.log(`Time taken to fetch student details: ${endTime - startTime}ms`);

    // Log the result
    if (result) {
      console.log('Successfully fetched student details');
    } else {
      console.log('No student details found');
    }

    return result;
  } catch (err) {
    console.error('An unexpected error occurred while fetching student details:', err);
    throw err;
  }
}
