// Student data types for Supabase integration

// Attendance data structure
export interface AttendanceData {
  attendance_percentage?: string;
  total_classes?: string;
  _metadata?: any;
  [subject: string]: any; // For subject-wise attendance
}

// Mid-term marks lab structure
export interface LabMarksData {
  [labName: string]: string;
}

// Mid-term marks subject structure
export interface SubjectMarksData {
  mid1?: string;
  mid2?: string;
  total?: string;
}

// Mid-term marks data structure
export interface MidMarksData {
  labs?: LabMarksData;
  subjects?: {
    [subject: string]: SubjectMarksData;
  };
  branch?: string;
  section?: string;
  semester?: string;
  data_type?: string;
  roll_number?: string;
  academic_year?: string;
  last_updated?: string;
  _metadata?: any;
}

// Personal details data structure
export interface PersonalDetailsData {
  Name?: string;
  'S.No'?: string;
  'Roll No'?: string;
  'Father Name'?: string;
  'Parent Mobile'?: string;
  'Student Mobile'?: string;
  Aadhaar?: string;
  extracted_at?: string;
  _metadata?: any;
  [key: string]: any; // For other personal details
}

// Student data from Supabase
export interface StudentData {
  roll_number: string;
  _academic_year: string;
  _year_sem: string;
  _branch?: string;
  _section?: string;
  personal_details?: PersonalDetailsData;
  attendance?: AttendanceData;
  mid_marks?: MidMarksData;
  csv_data?: any;
}

// Processed mid marks structure
export interface ProcessedMidMarksData {
  subjects: Array<{
    name: string;
    mid1: string | null;
    mid2: string | null;
    total: string | null;
  }>;
  labs: Array<{
    name: string;
    total: string | null;
  }>;
  metadata?: any;
  branch?: string;
  section?: string;
  semester?: string;
  data_type?: string;
  roll_number?: string;
  academic_year?: string;
  last_updated?: string;
}

// Processed student data for display
export interface ProcessedStudentData {
  rollNumber: string;
  academicYear: string;
  yearSem: string;
  branch?: string;
  section?: string;
  personalDetails?: PersonalDetailsData;
  attendance?: AttendanceData;
  attendancePercentage?: string;
  totalClasses?: string;
  midMarks?: MidMarksData;
  processedMidMarks?: ProcessedMidMarksData;
  csvData?: any;
}
