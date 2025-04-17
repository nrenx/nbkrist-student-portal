import { supabase } from '@/lib/supabase';
import { StudentData, ProcessedStudentData } from '@/types/student';
import { processMidMarks } from '@/utils/processStudentData';

/**
 * Fetch student details from Supabase
 * @param rollNumber - Student roll number
 * @param academicYear - Academic year (e.g., "2023-24")
 * @param yearSem - Year and semester code (e.g., "11" for First Yr - First Sem)
 * @returns Processed student data or null if not found
 */
export async function fetchStudentDetails(
  rollNumber: string,
  academicYear: string,
  yearSem: string
): Promise<ProcessedStudentData | null> {
  try {
    // Ensure roll number is uppercase
    const uppercaseRollNumber = rollNumber.toUpperCase();
    console.log('Query parameters:', { rollNumber: uppercaseRollNumber, academicYear, yearSem });

    // Simple direct query to match the example code
    const { data, error } = await supabase
      .from('students')
      .select(`
        roll_number,
        _academic_year,
        _year_sem,
        _branch,
        _section,
        personal_details,
        attendance,
        mid_marks,
        csv_data
      `)
      .eq('roll_number', uppercaseRollNumber)
      .eq('_academic_year', academicYear)
      .eq('_year_sem', yearSem)
      .single();

    // Log the raw response for debugging
    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error fetching student data:', error);
      if (error.code === 'PGRST116') {
        // This is the error code for "No rows returned" when using .single()
        console.log('No student found with the provided details');
        return null;
      }
      throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
    }

    if (!data) {
      return null;
    }

    // Extract attendance percentage and total classes directly from the attendance object
    const attendancePercentage = data.attendance?.attendance_percentage;
    const totalClasses = data.attendance?.total_classes;

    // Process mid-marks data to separate subjects and labs
    const processedMidMarks = processMidMarks(data.mid_marks);
    console.log('Processed mid marks:', processedMidMarks);

    // Process and return the data using the original field names
    const processedData = {
      rollNumber: data.roll_number,
      academicYear: data._academic_year,
      yearSem: data._year_sem,
      branch: data._branch,
      section: data._section,
      personalDetails: data.personal_details,
      attendance: data.attendance,
      attendancePercentage,
      totalClasses,
      midMarks: data.mid_marks,
      processedMidMarks,
      csvData: data.csv_data
    };

    console.log('Processed student data:', processedData);
    return processedData;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    throw err;
  }
}
