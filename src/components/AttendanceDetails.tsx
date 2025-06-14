import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceData } from '@/types/student';
import { Calendar, CheckCircle, BarChart, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { useIsMobile } from '@/hooks/use-mobile';

interface AttendanceDetailsProps {
  attendance: AttendanceData;
  attendancePercentage?: string;
  totalClasses?: string;
  lastUpdated?: string;
}

const AttendanceDetails = ({
  attendance,
  attendancePercentage,
  totalClasses,
  lastUpdated
}: AttendanceDetailsProps) => {
  const isMobile = useIsMobile();

  // Filter out metadata and special fields
  const subjectAttendance = Object.entries(attendance || {})
    .filter(([key, value]) =>
      !['attendance_percentage', 'total_classes', '_metadata'].includes(key) &&
      value !== null &&
      value !== undefined
    );

  return (
    <Card className="overflow-hidden mt-6">
      <CardHeader className="bg-nbkr text-white">
        <CardTitle className={`flex items-center justify-between ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          <div className="flex items-center">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
            <span>Attendance Information {lastUpdated && (
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal ml-1`}>
                (Last Updated: {formatDate(lastUpdated)})
              </span>
            )}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "p-3" : "p-6"}>
        <div className={isMobile ? "space-y-3" : "space-y-4"}>
          {/* Overall attendance */}
          <div className={`flex flex-col md:flex-row gap-4 ${isMobile ? 'mb-3' : 'mb-4'}`}>
            <div className={`bg-gray-50 ${isMobile ? 'p-3' : 'p-4'} rounded-lg flex-1`}>
              <h3 className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-700 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                <BarChart className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2 text-nbkr`} />
                Overall Attendance
              </h3>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-nbkr`}>
                {attendancePercentage || attendance?.attendance_percentage || 'N/A'}
              </div>
            </div>
            <div className={`bg-gray-50 ${isMobile ? 'p-3' : 'p-4'} rounded-lg flex-1`}>
              <h3 className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-700 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                <Clock className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2 text-nbkr`} />
                Total Classes
              </h3>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-nbkr`}>
                {totalClasses || attendance?.total_classes || 'N/A'}
              </div>
            </div>
          </div>

          {/* Subject-wise attendance */}
          {subjectAttendance.length > 0 ? (
            <div>
              <h3 className={`flex items-center ${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-700 ${isMobile ? 'mb-2' : 'mb-3'}`}>
                <CheckCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2 text-nbkr`} />
                Subject-wise Attendance
              </h3>
              <div className={`grid ${isMobile ? 'grid-cols-3 sm:grid-cols-4 gap-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'}`}>
                {subjectAttendance.map(([subject, value]) => (
                  <div
                    key={subject}
                    className={`${isMobile ? 'flex flex-col p-1 min-w-0 h-16 justify-center' : 'flex items-center p-3'} border rounded-md hover:bg-gray-50`}
                  >
                    {isMobile ? (
                      <>
                        <div className="font-medium text-xs mb-0.5 truncate w-full text-center px-0.5">{subject}</div>
                        {value !== 'NOT_ENTERED' && (
                          <div className="text-sm font-bold text-nbkr text-center">{value}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-medium">{subject}</div>
                          <div className="text-sm text-gray-500">
                            {value !== 'NOT_ENTERED' ? value : 'Not Entered'}
                          </div>
                        </div>
                        {value !== 'NOT_ENTERED' && (
                          <div className="text-lg font-bold text-nbkr">{value}</div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No subject-wise attendance data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceDetails;
