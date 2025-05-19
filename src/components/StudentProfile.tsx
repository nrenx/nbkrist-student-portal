
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Book, Calendar, Award, MapPin, Phone, Mail, School } from "lucide-react";
import { ProcessedStudentData } from '@/types/student';
import { useIsMobile } from '@/hooks/use-mobile';

interface StudentProfileProps {
  data: ProcessedStudentData;
}

const StudentProfile = ({ data }: StudentProfileProps) => {
  const isMobile = useIsMobile();

  // Helper function to convert yearSem code to readable text
  const getYearSemText = (code: string) => {
    // If the code is already in the format '1-1', '2-2', etc., return it as is
    if (code && code.includes('-')) {
      return code;
    }

    // Otherwise, convert from the old format
    const yearMap: Record<string, string> = {
      '01': 'First Year',
      '11': '1-1',
      '12': '1-2',
      '21': '2-1',
      '22': '2-2',
      '31': '3-1',
      '32': '3-2',
      '41': '4-1',
      '42': '4-2',
    };
    return yearMap[code] || code;
  };

  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader className={`bg-nbkr text-white ${isMobile ? 'p-3' : 'p-6'}`}>
          <CardTitle className={`flex items-center justify-between ${isMobile ? 'text-base' : 'text-2xl'}`}>
            <span>Student Details</span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>Roll No: {data.rollNumber}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "p-3" : "p-6"}>
          {isMobile ? (
            // Mobile layout - more compact
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={32} />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">
                  {data.personalDetails?.Name || data.rollNumber}
                </h3>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                  {data.branch && (
                    <div className="flex items-center">
                      <Book className="w-3 h-3 text-nbkr mr-1 flex-shrink-0" />
                      <span className="text-xs truncate">{data.branch}</span>
                    </div>
                  )}

                  {data.section && (
                    <div className="flex items-center">
                      <School className="w-3 h-3 text-nbkr mr-1 flex-shrink-0" />
                      <span className="text-xs truncate">{data.section}</span>
                    </div>
                  )}

                  {data.academicYear && (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 text-nbkr mr-1 flex-shrink-0" />
                      <span className="text-xs truncate">{data.academicYear}</span>
                    </div>
                  )}

                  {data.yearSem && (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 text-nbkr mr-1 flex-shrink-0" />
                      <span className="text-xs truncate">{getYearSemText(data.yearSem)}</span>
                    </div>
                  )}
                </div>

                {/* Data availability indicators */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.personalDetails && Object.keys(data.personalDetails).length > 2 && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] rounded-full">
                      Personal Details
                    </span>
                  )}
                  {data.attendance && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-full">
                      Attendance
                    </span>
                  )}
                  {data.midMarks && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded-full">
                      Mid Marks
                    </span>
                  )}
                  {(!data.personalDetails || Object.keys(data.personalDetails).length <= 2) &&
                   !data.attendance && !data.midMarks && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full">
                      Limited Data
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Desktop layout - original
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-center">
                  {data.personalDetails?.Name || data.rollNumber}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{data.rollNumber}</p>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {data.branch && (
                      <div className="flex items-center">
                        <Book className="w-5 h-5 text-nbkr mr-2" />
                        <span className="text-sm font-medium">Branch:</span>
                        <span className="ml-2 text-sm">{data.branch}</span>
                      </div>
                    )}

                    {data.section && (
                      <div className="flex items-center">
                        <School className="w-5 h-5 text-nbkr mr-2" />
                        <span className="text-sm font-medium">Section:</span>
                        <span className="ml-2 text-sm">{data.section}</span>
                      </div>
                    )}

                    {data.academicYear && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-nbkr mr-2" />
                        <span className="text-sm font-medium">Academic Year:</span>
                        <span className="ml-2 text-sm">{data.academicYear}</span>
                      </div>
                    )}

                    {data.yearSem && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-nbkr mr-2" />
                        <span className="text-sm font-medium">Year-Semester:</span>
                        <span className="ml-2 text-sm">{getYearSemText(data.yearSem)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Additional information can be displayed here if needed */}
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-nbkr mr-2" />
                      <span className="text-sm font-medium">Student ID:</span>
                      <span className="ml-2 text-sm">{data.rollNumber}</span>
                    </div>

                    {/* Show data availability indicators */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {data.personalDetails && Object.keys(data.personalDetails).length > 2 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Personal Details Available
                        </span>
                      )}
                      {data.attendance && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Attendance Available
                        </span>
                      )}
                      {data.midMarks && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Mid Marks Available
                        </span>
                      )}
                      {(!data.personalDetails || Object.keys(data.personalDetails).length <= 2) &&
                       !data.attendance && !data.midMarks && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Limited Data Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
