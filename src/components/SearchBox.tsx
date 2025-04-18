import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStudentDetails } from '@/services/studentService';

const SearchBox = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [acadYear, setAcadYear] = useState('2024-25');
  const [yearSem, setYearSem] = useState('4-2'); // Default to Final Yr - Second Sem
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rollNumber.trim()) {
      toast.error("Please enter a roll number");
      return;
    }

    // Convert roll number to uppercase
    const uppercaseRollNumber = rollNumber.trim().toUpperCase();

    // For demonstration, we'll use a regex pattern to validate roll number format
    // This should be customized based on your college's roll number format
    const rollNumberPattern = /^[0-9A-Z]{1,12}$/;

    if (!rollNumberPattern.test(uppercaseRollNumber)) {
      toast.error("Please enter a valid roll number format");
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to the student details page with the form values
      // The actual data fetching will happen in the StudentDetails component
      navigate(`/student/${uppercaseRollNumber}`, { state: { acadYear, yearSem } });
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while fetching student details");
      console.error("Error fetching student details:", error);
    }
  };

  return (
    <div className="search-container animate-fade-in">
      <form onSubmit={handleSearch} className="flex flex-col space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter your roll number (e.g., **KB*A0501)"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full"
            autoComplete="off"
            onBlur={(e) => {
              // Convert to uppercase when the field loses focus
              if (e.target.value.trim()) {
                setRollNumber(e.target.value.trim().toUpperCase());
              }
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="acadYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <Select value={acadYear} onValueChange={setAcadYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
                <SelectItem value="2021-22">2021-22</SelectItem>
                <SelectItem value="2020-21">2020-21</SelectItem>
                <SelectItem value="2019-20">2019-20</SelectItem>
                <SelectItem value="2018-19">2018-19</SelectItem>
                <SelectItem value="2017-18">2017-18</SelectItem>
                <SelectItem value="2016-17">2016-17</SelectItem>
                <SelectItem value="2015-16">2015-16</SelectItem>
                <SelectItem value="2014-15">2014-15</SelectItem>
                <SelectItem value="2013-14">2013-14</SelectItem>
                <SelectItem value="2012-13">2012-13</SelectItem>
                <SelectItem value="2011-12">2011-12</SelectItem>
                <SelectItem value="2010-11">2010-11</SelectItem>
                <SelectItem value="2009-10">2009-10</SelectItem>
                <SelectItem value="2008-09">2008-09</SelectItem>
                <SelectItem value="2007-08">2007-08</SelectItem>
                <SelectItem value="2006-07">2006-07</SelectItem>
                <SelectItem value="2005-06">2005-06</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="yearSem" className="block text-sm font-medium text-gray-700 mb-1">
              Year of Study
            </label>
            <Select value={yearSem} onValueChange={setYearSem}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year of study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1">1-1</SelectItem>
                <SelectItem value="1-2">1-2</SelectItem>
                <SelectItem value="2-1">2-1</SelectItem>
                <SelectItem value="2-2">2-2</SelectItem>
                <SelectItem value="3-1">3-1</SelectItem>
                <SelectItem value="3-2">3-2</SelectItem>
                <SelectItem value="4-1">4-1</SelectItem>
                <SelectItem value="4-2">4-2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-nbkr hover:bg-nbkr-dark"
          disabled={isLoading}
        >
          {isLoading ? "Fetching..." : "Fetch Details"}
        </Button>
      </form>
    </div>
  );
};

export default SearchBox;
