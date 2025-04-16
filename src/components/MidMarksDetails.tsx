import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MidMarksData, ProcessedMidMarksData } from '@/types/student';
import { Award, BookOpen, Beaker } from 'lucide-react';

interface MidMarksDetailsProps {
  midMarks: MidMarksData;
  processedMidMarks?: ProcessedMidMarksData;
}

const MidMarksDetails = ({ midMarks, processedMidMarks }: MidMarksDetailsProps) => {
  // Log the data structures for debugging
  console.log('MidMarks structure:', midMarks);
  console.log('Processed MidMarks:', processedMidMarks);

  // Use the processed mid marks if available
  const useProcessedData = !!processedMidMarks &&
                          processedMidMarks.subjects.length > 0;

  console.log('Using processed data:', useProcessedData);

  // If we're using processed data, we'll use that directly
  // Otherwise, fall back to the old detection logic
  let theoryMarks: [string, any][] = [];
  let labMarks: [string, any][] = [];
  let useDetailedDisplay = false;

  if (useProcessedData) {
    // No need to do any detection, we already have the data in the right format
    useDetailedDisplay = true;
  } else {
    // Fall back to the old detection logic
    // First, check if the data has the expected nested structure
    const hasSubjectsObject = typeof midMarks?.subjects === 'object' && midMarks.subjects !== null;
    const hasLabsObject = typeof midMarks?.labs === 'object' && midMarks.labs !== null;

    // Check if the first theory subject has mid1, mid2, total structure
    let hasDetailedMarks = false;
    if (hasSubjectsObject) {
      const subjectEntries = Object.entries(midMarks.subjects);
      if (subjectEntries.length > 0) {
        const firstSubject = subjectEntries[0][1];
        hasDetailedMarks = firstSubject && typeof firstSubject === 'object' &&
                          ('mid1' in firstSubject || 'mid2' in firstSubject || 'total' in firstSubject);
      }
    }

    const hasNewStructure = hasSubjectsObject && hasLabsObject;
    useDetailedDisplay = hasNewStructure && hasDetailedMarks;

    console.log('Has new structure:', hasNewStructure);
    console.log('Has detailed marks:', hasDetailedMarks);
    console.log('Using detailed display:', useDetailedDisplay);

    if (hasNewStructure) {
      // Use the new structure
      theoryMarks = Object.entries(midMarks.subjects || {})
        .filter(([_, value]) => value !== null && value !== undefined);

      labMarks = Object.entries(midMarks.labs || {})
        .filter(([_, value]) => value !== null && value !== undefined);
    } else {
      // Fallback to the old structure
      const allMarks = Object.entries(midMarks || {}).filter(
        ([key, value]) =>
          !['_metadata', 'branch', 'section', 'semester', 'data_type', 'roll_number', 'academic_year', 'last_updated', 'subjects', 'labs'].includes(key) &&
          value !== null &&
          value !== undefined
      );

      labMarks = allMarks.filter(([subject]) =>
        subject.toLowerCase().includes('lab') ||
        subject.toLowerCase().includes('practical') ||
        subject.toLowerCase().includes('workshop')
      );

      theoryMarks = allMarks.filter(([subject]) =>
        !subject.toLowerCase().includes('lab') &&
        !subject.toLowerCase().includes('practical') &&
        !subject.toLowerCase().includes('workshop')
      );
    }
  }

  return (
    <Card className="overflow-hidden mt-6">
      <CardHeader className="bg-nbkr text-white">
        <CardTitle className="flex items-center">
          <Award className="w-5 h-5 mr-2" />
          <span>Mid-term Marks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Theory subjects */}
          {(useProcessedData && processedMidMarks?.subjects.length > 0) || (!useProcessedData && theoryMarks.length > 0) ? (
            <div>
              <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                <BookOpen className="w-5 h-5 mr-2 text-nbkr" />
                Theory Subjects
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border">Subject</th>
                      {useDetailedDisplay ? (
                        <>
                          <th className="text-center p-3 border">Mid 1</th>
                          <th className="text-center p-3 border">Mid 2</th>
                          <th className="text-center p-3 border">Total</th>
                        </>
                      ) : (
                        <th className="text-center p-3 border">Marks</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {useProcessedData && processedMidMarks ? (
                      // Use the processed data structure
                      processedMidMarks.subjects.map((subject) => (
                        <tr key={subject.name} className="hover:bg-gray-50">
                          <td className="p-3 border font-medium">{subject.name}</td>
                          <td className="p-3 border text-center">
                            {subject.mid1 && subject.mid1 !== 'NOT_ENTERED' ? subject.mid1 : '-'}
                          </td>
                          <td className="p-3 border text-center">
                            {subject.mid2 && subject.mid2 !== 'NOT_ENTERED' ? subject.mid2 : '-'}
                          </td>
                          <td className="p-3 border text-center font-semibold">
                            {subject.total && subject.total !== 'NOT_ENTERED' ? subject.total : '-'}
                          </td>
                        </tr>
                      ))
                    ) : useDetailedDisplay ? (
                      // Detailed structure with mid1, mid2, total
                      theoryMarks.map(([subject, marks]) => (
                        <tr key={subject} className="hover:bg-gray-50">
                          <td className="p-3 border font-medium">{subject}</td>
                          <td className="p-3 border text-center">
                            {marks.mid1 && marks.mid1 !== 'NOT_ENTERED' ? marks.mid1 : '-'}
                          </td>
                          <td className="p-3 border text-center">
                            {marks.mid2 && marks.mid2 !== 'NOT_ENTERED' ? marks.mid2 : '-'}
                          </td>
                          <td className="p-3 border text-center font-semibold">
                            {marks.total && marks.total !== 'NOT_ENTERED' ? marks.total : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Simple structure - just show the value
                      theoryMarks.map(([subject, marks]) => {
                        // Check if marks is an object with mid1, mid2, total
                        const isDetailedObject = marks && typeof marks === 'object' &&
                                               ('mid1' in marks || 'mid2' in marks || 'total' in marks);

                        // If it's a detailed object, show the total or mid2 or mid1 (in that order of preference)
                        const displayValue = isDetailedObject
                          ? (marks.total || marks.mid2 || marks.mid1 || 'Not Entered')
                          : (marks !== 'NOT_ENTERED' ? marks : 'Not Entered');

                        return (
                          <tr key={subject} className="hover:bg-gray-50">
                            <td className="p-3 border font-medium">{subject}</td>
                            <td className="p-3 border text-center">
                              {displayValue}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No theory subject marks available
            </div>
          )}

          {/* Lab subjects */}
          {(useProcessedData && processedMidMarks?.labs.length > 0) || (!useProcessedData && labMarks.length > 0) ? (
            <div>
              <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                <Beaker className="w-5 h-5 mr-2 text-nbkr" />
                Lab Subjects
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border">Subject</th>
                      <th className="text-center p-3 border">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {useProcessedData && processedMidMarks ? (
                      // Use the processed data structure
                      processedMidMarks.labs.map((lab) => (
                        <tr key={lab.name} className="hover:bg-gray-50">
                          <td className="p-3 border font-medium">{lab.name}</td>
                          <td className="p-3 border text-center">
                            {lab.total && lab.total !== 'NOT_ENTERED' ? lab.total : 'Not Entered'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Use the old structure
                      labMarks.map(([subject, marks]) => {
                        // Check if marks is an object with total
                        const isDetailedObject = marks && typeof marks === 'object' && 'total' in marks;

                        // If it's a detailed object, show the total
                        const displayValue = isDetailedObject
                          ? (marks.total !== 'NOT_ENTERED' ? marks.total : 'Not Entered')
                          : (marks !== 'NOT_ENTERED' ? marks : 'Not Entered');

                        return (
                          <tr key={subject} className="hover:bg-gray-50">
                            <td className="p-3 border font-medium">{subject}</td>
                            <td className="p-3 border text-center">
                              {displayValue}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Semester and Branch info if available */}
          {(midMarks?.semester || midMarks?.branch) && (
            <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4">
              {midMarks.semester && (
                <div>Semester: {midMarks.semester}</div>
              )}
              {midMarks.branch && midMarks.section && (
                <div>Class: {midMarks.branch} - {midMarks.section}</div>
              )}
              {midMarks.last_updated && (
                <div>Last Updated: {new Date(midMarks.last_updated).toLocaleDateString()}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MidMarksDetails;
