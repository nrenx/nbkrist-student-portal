
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import StudentProfile from '@/components/StudentProfile';
import AttendanceDetails from '@/components/AttendanceDetails';
import MidMarksDetails from '@/components/MidMarksDetails';
import PersonalDetails from '@/components/PersonalDetails';
import { AdBanner, AdsterraAd, AdsterraNativeBanner } from '@/features/ads';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchStudentDetails } from '@/services/studentService';
import { ProcessedStudentData } from '@/types/student';
import { Helmet } from 'react-helmet';

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

  // Create dynamic title and description based on student data
  const studentName = studentData?.personalDetails?.Name || rollNumber;
  const pageTitle = studentData
    ? `${studentName} | NBKRIST Student Details`
    : `Student Details | NBKRIST Student Portal`;

  const pageDescription = studentData
    ? `View academic information, attendance records, and exam results for ${studentName} at NBKRIST.`
    : `Access student academic information, attendance records, and exam results at NBKR Institute of Science & Technology.`;

  // Create structured data for student details
  const getStructuredData = () => {
    if (!studentData) return null;

    const studentName = studentData.personalDetails?.name || `Student ${rollNumber}`;
    const branch = studentData.personalDetails?.branch || '';
    const section = studentData.personalDetails?.section || '';

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": studentName,
      "identifier": rollNumber,
      "description": `${studentName} is a student at NBKR Institute of Science & Technology in the ${branch} department, section ${section}.`,
      "affiliation": {
        "@type": "EducationalOrganization",
        "name": "NBKR Institute of Science & Technology",
        "url": "https://nbkrstudenthub.me"
      }
    };
  };

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
      keywords={`nbkr, nbkrist, nbkr student portal, nbkr student login, ${rollNumber}, student details, attendance, mid marks`}
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      {studentData && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(getStructuredData())}
          </script>
        </Helmet>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Back button - always visible regardless of loading state */}
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

        {/* Only show ads when not in loading state and no errors */}
        {!loading && !error && (
          <>
            {/* Top Ad Banner - Higher visibility */}
            <div className="mb-8">
              <AdsterraAd
                adKey="df08e80e0411f467a2bf4c4b472cfa73"
                width={728}
                height={90}
                className="mx-auto"
              />
            </div>

            {/* Pre-search ad for mobile - high visibility */}
            {isMobile && (
              <div className="mb-6">
                <AdsterraNativeBanner
                  adKey="0ff47a52378e603887c6c43532a138d8"
                  className="w-full"
                />
              </div>
            )}
          </>
        )}

        {/* In-content ad for mobile users - only shown when not loading and no errors */}
        {!loading && !error && isMobile && (
          <div className="my-4">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="7861560560"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '7861560560',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Ad on larger screens - only shown when not loading and no errors */}
          {!loading && !error && (
            <div className="hidden md:flex md:w-1/5 justify-center">
              <AdBanner
                width="w-[160px]"
                height="h-[600px]"
                slotId="4884043433"
                network="google"
                adConfig={{
                  'data-ad-client': 'ca-pub-7831792005606531',
                  'data-ad-slot': '4884043433',
                  'data-ad-format': 'vertical'
                }}
              />
            </div>
          )}

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
                      lastUpdated={studentData.midMarks?.last_updated}
                    />
                  )}

                  {/* In-content ad - between attendance and mid-term marks - only shown if both sections exist */}
                  {studentData.attendance && studentData.midMarks && (
                    <div className="my-6">
                      <AdBanner
                        width="w-full"
                        height="h-auto"
                        slotId="7861560560"
                        network="google"
                        adConfig={{
                          'data-ad-client': 'ca-pub-7831792005606531',
                          'data-ad-slot': '7861560560',
                          'data-ad-format': 'auto',
                          'data-full-width-responsive': 'true'
                        }}
                      />
                    </div>
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

                  {/* Post-search ad - high engagement area */}
                  <div className="mt-6">
                    <AdBanner
                      width="w-full"
                      height="h-auto"
                      slotId="2501197332"
                      network="google"
                      adConfig={{
                        'data-ad-client': 'ca-pub-7831792005606531',
                        'data-ad-slot': '2501197332',
                        'data-ad-format': 'auto',
                        'data-full-width-responsive': 'true'
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Ad on larger screens - premium spot - only shown when not loading and no errors */}
          {!loading && !error && (
            <div className="hidden md:flex md:w-1/5 justify-center">
              <AdBanner
                width="w-[160px]"
                height="h-[600px]"
                slotId="4884043433"
                network="google"
                adConfig={{
                  'data-ad-client': 'ca-pub-7831792005606531',
                  'data-ad-slot': '4884043433',
                  'data-ad-format': 'vertical'
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Banner Ad - for all devices - only shown when not loading and no errors */}
        {!loading && !error && (
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="8416703140"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8416703140',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>
        )}

        {/* Mobile Banner ad - for mobile users - only shown when not loading and no errors */}
        {!loading && !error && isMobile && (
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="8380435316"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8380435316',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDetails;
