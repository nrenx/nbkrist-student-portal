import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AdBanner, AdsterraAd, AdsterraNativeBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchForm from '@/components/StudentNameSearchForm';
import SearchResults from '@/components/StudentNameSearchResults';
import useStudentSearch from '@/hooks/useStudentNameSearch';
import { SearchParams } from '@/types/student';

const StudentNameSearch = () => {
  const isMobile = useIsMobile();
  const { searchStudents, cancelSearch, results, loading, error, progress, hasSearched } = useStudentSearch();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    searchStudents(params);
  };

  const handleCancel = () => {
    cancelSearch();
  };

  return (
    <Layout
      title="Search Students by Name | NBKRIST Student Portal"
      description="Search for NBKRIST students by name. Find student information without knowing their roll number."
      keywords="nbkr student search, nbkrist name search, nbkr find student, nbkrist student lookup, nbkr student name search"
      ogType="website"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Search Students by Name</h1>

          {/* Top Banner Ad */}
          <div className="mb-8">
            <AdPlaceholder
              width="w-full"
              height="h-28"
              label="Top Banner Ad (Removed duplicate)"
            />
          </div>



          <Card className="bg-white shadow-md mb-6">
            <CardHeader className="border-b bg-blue-50">
              <CardTitle>Search Criteria</CardTitle>
              <CardDescription>
                Enter any part of a student's name and select academic filters to find matching students
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SearchForm onSearch={handleSearch} loading={loading} progress={progress} />
            </CardContent>
          </Card>

          {!hasSearched && !loading && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Enter any part of a student's name (first, middle, or last name) along with the academic year and year of study to search for matching students.
              </AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="text-center">
              <div className="text-sm text-gray-500">
                <p>Searching student records... {progress.toFixed(0)}%</p>
                {searchParams && (
                  <p className="mt-2 text-xs">
                    Searching for names containing "{searchParams.namePrefix}" in {searchParams.academicYear}/{searchParams.yearOfStudy}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleCancel}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Search
                </Button>
              </div>
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && hasSearched && !error && results.length === 0 && (
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertDescription>
                No students found matching your search criteria. Try adjusting your search.
              </AlertDescription>
            </Alert>
          )}

          {!loading && results.length > 0 && (
            <SearchResults results={results} />
          )}

          {/* In-content Ad */}
          <div className="my-8">
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

          {/* Bottom Banner Ad */}
          <div className="mt-8">
            <AdsterraAd
              adKey="8b14f87d9dbd67ea5fc6fb3f83ad3c48"
              width={468}
              height={60}
              className="mx-auto"
            />
          </div>

          {/* Mobile Sticky Ad */}
          {isMobile && (
            <div className="mt-8 sticky bottom-0 z-50">
              <AdsterraAd
                adKey="9b331e1b14b4c9d25f6130507dfa0bd5"
                width={320}
                height={50}
                className="mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentNameSearch;
