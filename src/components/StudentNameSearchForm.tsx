import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchParams } from '@/types/student';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
  progress?: number;
}

// Academic years and years of study
const ACADEMIC_YEARS = [
  '2025-26', '2024-25', '2023-24', '2022-23', '2021-22', '2020-21',
  '2019-20', '2018-19', '2017-18', '2016-17', '2015-16'
];
const YEARS_OF_STUDY = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

export default function SearchForm({ onSearch, loading, progress }: SearchFormProps) {
  const [nameSearch, setNameSearch] = useState('');
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0]);
  const [yearOfStudy, setYearOfStudy] = useState(YEARS_OF_STUDY[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      namePrefix: nameSearch.trim(),
      academicYear,
      yearOfStudy
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nameSearch">Student Name Search</Label>
          <Input
            id="nameSearch"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Enter full or partial student name"
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="academicYear">Academic Year</Label>
            <Select
              value={academicYear}
              onValueChange={setAcademicYear}
              disabled={loading}
              required
            >
              <SelectTrigger id="academicYear" className="mt-1 w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="yearOfStudy">Year of Study</Label>
            <Select
              value={yearOfStudy}
              onValueChange={setYearOfStudy}
              disabled={loading}
              required
            >
              <SelectTrigger id="yearOfStudy" className="mt-1 w-full">
                <SelectValue placeholder="Select year of study" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_OF_STUDY.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading || !nameSearch || !academicYear || !yearOfStudy}
      >
        {loading ? (
          <>
            <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Searching...
          </>
        ) : (
          'Search Students'
        )}
      </Button>

      {loading && progress !== undefined && (
        <div className="w-full mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </form>
  );
}
