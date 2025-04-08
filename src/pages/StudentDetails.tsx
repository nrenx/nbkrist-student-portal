import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import StudentProfile from '@/components/StudentProfile';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"; // Updated import

const StudentDetails = () => {
  const { rollNumber } = useParams<{ rollNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call to get student data
    // In a real application, replace this with your actual API call
    const fetchStudentData = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // For demo purposes, only show data for certain roll numbers
        // In a real app, this would be an API call to your backend
        if (rollNumber && ['123456', '19BCS7046', '20BCE1234', 'DEMO123'].includes(rollNumber)) {
          // Mock student data
          const mockData = {
            rollNumber: rollNumber,
            name: 'John Doe',
            branch: 'Computer Science Engineering',
            year: '3rd Year',
            section: 'A',
            cgpa: 8.75,
            address: 'Vidyanagar, Nellore District, AP',
            mobile: '+91 9876543210',
            email: `${rollNumber.toLowerCase()}@nbkrist.ac.in`,
          };
          
          setStudentData(mockData);
          setLoading(false);
        } else {
          setError('No student found with the provided roll number.');
          toast.error('No student found with the provided roll number.');
          setLoading(false);
        }
      }, 1500);
    };

    if (rollNumber) {
      fetchStudentData();
    }
  }, [rollNumber]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Top Ad Banner */}
        <div className="mb-8">
          <AdBanner width="w-full" height="h-24" />
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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Ad on larger screens */}
          <div className="hidden md:block md:w-1/5">
            <AdBanner width="w-full" height="h-full min-h-[400px]" />
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
              <StudentProfile data={studentData} />
            )}
          </div>

          {/* Right Ad on larger screens */}
          <div className="hidden md:block md:w-1/5">
            <AdBanner width="w-full" height="h-full min-h-[400px]" />
          </div>
        </div>

        {/* Bottom Ad on smaller screens */}
        <div className="md:hidden mt-8">
          <AdBanner width="w-full" height="h-32" />
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetails;
