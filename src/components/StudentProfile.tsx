
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Book, Calendar, Award, MapPin, Phone, Mail } from "lucide-react";

// This is a mock interface for student data
// In a real application, this would come from your backend
interface StudentData {
  rollNumber: string;
  name: string;
  branch: string;
  year: string;
  section: string;
  cgpa: number;
  address: string;
  mobile: string;
  email: string;
  profile_image?: string;
}

interface StudentProfileProps {
  data: StudentData;
}

const StudentProfile = ({ data }: StudentProfileProps) => {
  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader className="bg-nbkr text-white">
          <CardTitle className="flex items-center justify-between">
            <span>Student Details</span>
            <span className="text-sm font-normal">Roll No: {data.rollNumber}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {data.profile_image ? (
                  <img 
                    src={data.profile_image} 
                    alt={data.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg text-center">{data.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{data.rollNumber}</p>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Book className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">Branch:</span>
                    <span className="ml-2 text-sm">{data.branch}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">Year:</span>
                    <span className="ml-2 text-sm">{data.year}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">CGPA:</span>
                    <span className="ml-2 text-sm">{data.cgpa}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">Address:</span>
                    <span className="ml-2 text-sm">{data.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">Mobile:</span>
                    <span className="ml-2 text-sm">{data.mobile}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-nbkr mr-2" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="ml-2 text-sm">{data.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
