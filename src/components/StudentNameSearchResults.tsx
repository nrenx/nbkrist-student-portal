import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchResult } from '@/types/student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { maskAadhaar } from '@/utils/maskData';

interface SearchResultsProps {
  results: SearchResult[];
}

// Number of results to show per page
const RESULTS_PER_PAGE = 12;

export default function SearchResults({ results }: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!results || results.length === 0) {
    return null;
  }

  // Calculate pagination
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = Math.min(startIndex + RESULTS_PER_PAGE, results.length);
  const currentResults = results.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);

      // Adjust if we're near the beginning
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 2);
      }

      // Adjust if we're near the end
      if (endPage === totalPages - 1 && endPage - startPage < maxPagesToShow - 3) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="w-full space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-700">
          Search Results ({results.length} {results.length === 1 ? 'student' : 'students'} found)
        </h2>

        <p className="text-sm text-gray-500">
          Showing {startIndex + 1}-{endIndex} of {results.length}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentResults.map((result, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            {result.data ? (
              <>
                <CardHeader className="bg-blue-50 pb-2">
                  <CardTitle className="text-lg font-semibold text-blue-700">
                    {result.data.name || result.data.Name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Roll Number: <Badge variant="outline">{result.rollNumber}</Badge>
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {(result.data.fatherName || result.data['Father Name']) && (
                      <p className="text-sm">
                        <span className="font-semibold">Father's Name:</span> {result.data.fatherName || result.data['Father Name']}
                      </p>
                    )}
                    {(result.data.parentMobile || result.data['Parent Mobile']) && (
                      <p className="text-sm">
                        <span className="font-semibold">Parent Mobile:</span> {result.data.parentMobile || result.data['Parent Mobile']}
                      </p>
                    )}
                    {(result.data.studentMobile || result.data['Student Mobile']) && (
                      <p className="text-sm">
                        <span className="font-semibold">Student Mobile:</span> {result.data.studentMobile || result.data['Student Mobile']}
                      </p>
                    )}
                    {(result.data.aadhaar || result.data.Aadhaar) && (
                      <p className="text-sm">
                        <span className="font-semibold">Aadhaar:</span> {maskAadhaar(result.data.aadhaar || result.data.Aadhaar)}
                      </p>
                    )}
                  </div>


                </CardContent>
              </>
            ) : (
              <div className="p-4">
                <p className="font-medium text-red-500">Error: {result.error}</p>
                <p className="text-sm mt-1">Roll Number: {result.rollNumber}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {getPageNumbers().map((page, i) => (
              <PaginationItem key={i}>
                {page === '...' ? (
                  <span className="px-4 py-2">...</span>
                ) : (
                  <PaginationLink
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={typeof page === 'number' ? 'cursor-pointer' : ''}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
