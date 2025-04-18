
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import StudentProfile from '@/components/StudentProfile';
import AttendanceDetails from '@/components/AttendanceDetails';
import MidMarksDetails from '@/components/MidMarksDetails';
import PersonalDetails from '@/components/PersonalDetails';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchStudentDetails } from '@/services/studentService';
import { ProcessedStudentData } from '@/types/student';

const StudentDetails = () => {
  const { rollNumber } = useParams<{ rollNumber: string }>();
  const location = useLocation();
  const { acadYear, yearSem } = location.state || { acadYear: '2023-24', yearSem: '4-2' };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<ProcessedStudentData | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Function to fetch student data from Supabase
    const getStudentData = async () => {
      setLoading(true);
      setError(null);

      // Set a timeout to prevent the loading state from getting stuck
      const timeoutId = setTimeout(() => {
        console.log('Data fetch timeout - taking too long');
        setError('Request timed out. Please try again.');
        toast.error('Request timed out. Please try again.');
        setLoading(false);
      }, 30000); // 30 seconds timeout

      try {
        // Convert roll number to uppercase to ensure it matches the database format
        const uppercaseRollNumber = rollNumber ? rollNumber.toUpperCase() : '';
        console.log('Fetching student data with:', { rollNumber: uppercaseRollNumber, acadYear, yearSem });

        // Fetch student details from Supabase
        const data = await fetchStudentDetails(uppercaseRollNumber, acadYear, yearSem);
        console.log('Received data from Supabase:', data);

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        if (!data) {
          const errorMsg = 'No student found with the provided details.';
          console.log(errorMsg);
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          return;
        }

        setStudentData(data);
        setLoading(false);
        toast.success('Student data loaded successfully!');
      } catch (err: any) {
        // Clear the timeout since we got a response (even if it's an error)
        clearTimeout(timeoutId);

        const errorMsg = err?.message || 'Unknown error';
        console.error('Error fetching student data:', err);
        setError(`An error occurred: ${errorMsg}`);
        toast.error(`Error: ${errorMsg}`);
        setLoading(false);
      }
    };

    if (rollNumber) {
      getStudentData();
    }

    // Cleanup function to clear any pending timeouts if the component unmounts
    return () => {
      // No specific cleanup needed here since timeoutId is scoped to getStudentData
    };
  }, [rollNumber, acadYear, yearSem]);

  // Helper function to convert yearSem code to readable text
  const getYearText = (code: string) => {
    // If the code is already in the format '1-1', '2-2', etc., convert it to a readable format
    if (code && code.includes('-')) {
      const [year, sem] = code.split('-');
      const yearNames = ['First', 'Second', 'Third', 'Final'];
      const semNames = ['First', 'Second'];

      if (parseInt(year) >= 1 && parseInt(year) <= 4 && parseInt(sem) >= 1 && parseInt(sem) <= 2) {
        return `${yearNames[parseInt(year)-1]} Year - ${semNames[parseInt(sem)-1]} Semester`;
      }
      return code; // Return as is if it doesn't match the expected format
    }

    // Otherwise, use the old mapping
    const yearMap: Record<string, string> = {
      '01': 'First Year',
      '11': 'First Year - First Semester',
      '12': 'First Year - Second Semester',
      '21': 'Second Year - First Semester',
      '22': 'Second Year - Second Semester',
      '31': 'Third Year - First Semester',
      '32': 'Third Year - Second Semester',
      '41': 'Final Year - First Semester',
      '42': 'Final Year - Second Semester',
    };
    return yearMap[code] || 'Unknown';
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Top Ad Banner - Higher visibility */}
        <div className="mb-8">
          <AdBanner width="w-full" height="h-28" slotId="top-banner" />
        </div>

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Button>
        </div>

        {/* In-content ad for mobile users */}
        {isMobile && (
          <div className="my-4">
            <AdBanner width="w-full" height="h-20" slotId="mobile-mid-content" />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Ad on larger screens */}
          <div className="hidden md:block md:w-1/5">
            <AdBanner width="w-full" height="h-full min-h-[500px]" slotId="left-sidebar" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nbkr"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={handleBack}>Try Again</Button>
              </div>
            ) : studentData && (
              <>
                <div className="space-y-6">
                  {/* Basic student information */}
                  <StudentProfile data={studentData} />

                  {/* Attendance information if available */}
                  {studentData.attendance && (
                    <AttendanceDetails
                      attendance={studentData.attendance}
                      attendancePercentage={studentData.attendancePercentage}
                      totalClasses={studentData.totalClasses}
                    />
                  )}

                  {/* Mid-term marks if available */}
                  {studentData.midMarks && (
                    <MidMarksDetails
                      midMarks={studentData.midMarks}
                      processedMidMarks={studentData.processedMidMarks}
                    />
                  )}

                  {/* Personal details if available */}
                  {studentData.personalDetails && (
                    <PersonalDetails personalDetails={studentData.personalDetails} />
                  )}

                  {/* Ad below student profile - high engagement area */}
                  <div className="mt-6">
                    <AdBanner width="w-full" height="h-24" slotId="below-profile" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Ad on larger screens - premium spot */}
          <div className="hidden md:block md:w-1/5">
            <AdBanner width="w-full" height="h-full min-h-[500px]" slotId="right-sidebar" />
          </div>
        </div>

        {/* Bottom Ad on all screens */}
        <div className="mt-8">
          <AdBanner width="w-full" height="h-32" slotId="bottom-banner" />
        </div>

        {/* Sticky ad for mobile only - high visibility and engagement */}
        {isMobile && (
          <AdBanner width="w-full" height="h-16" slotId="mobile-sticky" type="sticky" />
        )}
      </div>
    </Layout>
  );
};

export default StudentDetails;
