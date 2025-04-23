import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalDetailsData } from '@/types/student';
import { User, Phone, Mail, CreditCard, UserCircle } from 'lucide-react';
import { maskAadhaar } from '@/utils/maskData';

interface PersonalDetailsProps {
  personalDetails: PersonalDetailsData;
}

const PersonalDetails = ({ personalDetails }: PersonalDetailsProps) => {
  // Filter out metadata and null values
  const details = Object.entries(personalDetails || {})
    .filter(([key, value]) =>
      key !== '_metadata' &&
      value !== null &&
      value !== undefined
    );

  // Format key for display
  const formatKey = (key: string) => {
    // If the key already has spaces and capitalization (like 'Father Name'), return it as is
    if (key.includes(' ') && /[A-Z]/.test(key)) {
      return key;
    }

    // Otherwise, format it
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get specific important details
  const getName = () => details.find(([key]) => key === 'Name')?.[1] || null;
  const getFatherName = () => details.find(([key]) => key === 'Father Name')?.[1] || null;
  const getParentMobile = () => details.find(([key]) => key === 'Parent Mobile')?.[1] || null;
  const getStudentMobile = () => details.find(([key]) => key === 'Student Mobile')?.[1] || null;
  const getAadhaar = () => details.find(([key]) => key === 'Aadhaar')?.[1] || null;
  const getRollNo = () => details.find(([key]) => key === 'Roll No')?.[1] || null;

  // Filter out the important details that we'll display separately
  const importantKeys = ['Name', 'Father Name', 'Parent Mobile', 'Student Mobile', 'Aadhaar', 'Roll No'];
  const otherDetails = details.filter(([key]) => !importantKeys.includes(key));

  return (
    <Card className="overflow-hidden mt-6">
      <CardHeader className="bg-nbkr text-white">
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          <span>Personal Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {details.length > 0 ? (
          <div className="space-y-6">
            {/* Important details in cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getName() && (
                <div className="p-4 border rounded-md flex items-center">
                  <UserCircle className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold">{getName()}</div>
                  </div>
                </div>
              )}

              {getFatherName() && (
                <div className="p-4 border rounded-md flex items-center">
                  <User className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Father's Name</div>
                    <div className="font-semibold">{getFatherName()}</div>
                  </div>
                </div>
              )}

              {getParentMobile() && (
                <div className="p-4 border rounded-md flex items-center">
                  <Phone className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Parent Mobile</div>
                    <div className="font-semibold">{getParentMobile()}</div>
                  </div>
                </div>
              )}

              {getStudentMobile() && getStudentMobile() !== '' && (
                <div className="p-4 border rounded-md flex items-center">
                  <Phone className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Student Mobile</div>
                    <div className="font-semibold">{getStudentMobile()}</div>
                  </div>
                </div>
              )}

              {getAadhaar() && getAadhaar() !== '' && (
                <div className="p-4 border rounded-md flex items-center">
                  <CreditCard className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Aadhaar</div>
                    <div className="font-semibold">{maskAadhaar(getAadhaar())}</div>
                  </div>
                </div>
              )}

              {getRollNo() && (
                <div className="p-4 border rounded-md flex items-center">
                  <Mail className="w-6 h-6 text-nbkr mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Roll Number</div>
                    <div className="font-semibold">{getRollNo()}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Other details in table */}
            {otherDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Information</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {otherDetails.map(([key, value]) => {
                        // Check if this is an Aadhaar field that wasn't caught by the importantKeys filter
                        const isAadhaarField = key.toLowerCase().includes('aadhaar') ||
                                              key.toLowerCase().includes('aadhar') ||
                                              key.toLowerCase().includes('uid');

                        return (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="p-3 border font-medium w-1/3">{formatKey(key)}</td>
                            <td className="p-3 border">
                              {isAadhaarField ? maskAadhaar(value as string) : (value || 'N/A')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No personal details available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
