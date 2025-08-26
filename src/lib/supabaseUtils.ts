import { supabase } from './supabase';

/**
 * Check if the Supabase connection is working properly
 * @returns An object with the connection status and any error messages
 */
export async function checkSupabaseConnection() {
  try {
    // Try to list buckets to check if the connection is working
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      return {
        connected: false,
        error: bucketsError.message,
        details: 'Failed to list storage buckets. This could be due to invalid API credentials or insufficient permissions.'
      };
    }

    // Filter out unwanted buckets
    const filteredBuckets = buckets.filter(bucket =>
      !['demouploadforfast', 'blog_images'].includes(bucket.name)
    );

    // Check if the student_data bucket exists
    const studentDataBucket = filteredBuckets.find(bucket => bucket.name === 'student_data');

    if (!studentDataBucket) {
      return {
        connected: true,
        buckets: filteredBuckets.map(b => b.name),
        error: 'student_data bucket does not exist',
        details: 'The student_data bucket is required for storing student information'
      };
    }

    // Try to list the contents of the student_data bucket
    const { data: rootItems, error: rootError } = await supabase.storage
      .from('student_data')
      .list();

    if (rootError) {
      return {
        connected: true,
        buckets: filteredBuckets.map(b => b.name),
        error: 'Cannot list contents of student_data bucket',
        details: rootError.message
      };
    }

    // Try to get a signed URL for a test file to check permissions
    const testPath = 'test.txt';
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('student_data')
      .createSignedUrl(testPath, 60);

    const hasSignedUrlPermission = !signedUrlError ||
      (signedUrlError.message && signedUrlError.message.includes('not found'));

    return {
      connected: true,
      buckets: filteredBuckets.map(b => b.name),
      rootItems: rootItems.map(item => item.name),
      hasSignedUrlPermission,
      message: 'Supabase connection is working properly'
    };
  } catch (err) {
    return {
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: 'An unexpected error occurred while checking the Supabase connection'
    };
  }
}

/**
 * List all academic years in the student_data bucket
 * @returns An object with the list of academic years and any error messages
 */
export async function listAcademicYears() {
  try {
    // Use pagination to get all academic years
    let allItems: any[] = [];
    let offset = 0;
    const PAGINATION_LIMIT = 1000; // Maximum allowed by Supabase
    let hasMore = true;

    console.log('Starting pagination to fetch all academic years');

    while (hasMore) {
      console.log(`Fetching academic years with offset ${offset}`);
      const { data: items, error } = await supabase.storage
        .from('student_data')
        .list('', {
          limit: PAGINATION_LIMIT,
          offset: offset,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        return {
          success: false,
          error: error.message,
          details: `Failed to list academic years at offset ${offset}`
        };
      }

      if (!items || items.length === 0) {
        // No more items to fetch
        hasMore = false;
      } else {
        // Add the items to our collection
        allItems = [...allItems, ...items];
        offset += items.length;

        // If this batch was smaller than the limit, we've reached the end
        if (items.length < PAGINATION_LIMIT) {
          hasMore = false;
        }

        console.log(`Fetched ${items.length} academic years, total so far: ${allItems.length}`);
      }
    }

    // Filter to only include folders (not files)
    const academicYears = allItems
      .filter(item => !item.name.includes('.'))
      .map(item => item.name)
      .sort((a, b) => b.localeCompare(a)); // Sort in descending order (newest first)

    console.log(`After filtering, found ${academicYears.length} academic years`);

    return {
      success: true,
      academicYears,
      message: `Found ${academicYears.length} academic years`
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: 'An unexpected error occurred while listing academic years'
    };
  }
}

/**
 * List all years of study for a specific academic year
 * @param academicYear The academic year (e.g., "2025-26")
 * @returns An object with the list of years of study and any error messages
 */
export async function listYearsOfStudy(academicYear: string) {
  try {
    // Use pagination to get all years of study
    let allItems: any[] = [];
    let offset = 0;
    const PAGINATION_LIMIT = 1000; // Maximum allowed by Supabase
    let hasMore = true;

    console.log(`Starting pagination to fetch all years of study in ${academicYear}`);

    while (hasMore) {
      console.log(`Fetching years of study with offset ${offset}`);
      const { data: items, error } = await supabase.storage
        .from('student_data')
        .list(academicYear, {
          limit: PAGINATION_LIMIT,
          offset: offset,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        return {
          success: false,
          error: error.message,
          details: `Failed to list years of study for ${academicYear} at offset ${offset}`
        };
      }

      if (!items || items.length === 0) {
        // No more items to fetch
        hasMore = false;
      } else {
        // Add the items to our collection
        allItems = [...allItems, ...items];
        offset += items.length;

        // If this batch was smaller than the limit, we've reached the end
        if (items.length < PAGINATION_LIMIT) {
          hasMore = false;
        }

        console.log(`Fetched ${items.length} years of study, total so far: ${allItems.length}`);
      }
    }

    // Filter to only include folders (not files)
    const yearsOfStudy = allItems
      .filter(item => !item.name.includes('.'))
      .map(item => item.name)
      .sort();

    console.log(`After filtering, found ${yearsOfStudy.length} years of study`);

    return {
      success: true,
      yearsOfStudy,
      message: `Found ${yearsOfStudy.length} years of study for ${academicYear}`
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: `An unexpected error occurred while listing years of study for ${academicYear}`
    };
  }
}

/**
 * Get a signed URL for a file in the student_data bucket
 * @param filePath The path to the file in the student_data bucket
 * @param expiresIn The number of seconds until the signed URL expires (default: 60)
 * @returns An object with the signed URL and any error messages
 */
export async function getSignedUrl(filePath: string, expiresIn: number = 60) {
  try {
    const { data, error } = await supabase.storage
      .from('student_data')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      return {
        success: false,
        error: error.message,
        details: `Failed to create signed URL for ${filePath}`
      };
    }

    return {
      success: true,
      signedUrl: data.signedUrl,
      message: `Created signed URL for ${filePath}`
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: `An unexpected error occurred while creating signed URL for ${filePath}`
    };
  }
}

/**
 * List all roll numbers in a specific year of study
 * @param academicYear The academic year (e.g., "2025-26")
 * @param yearOfStudy The year of study (e.g., "3-2")
 * @returns An object with the list of roll numbers and any error messages
 */
export async function listRollNumbers(academicYear: string, yearOfStudy: string) {
  try {
    // Try both path structures to ensure compatibility
    const paths = [
      `${academicYear}/${yearOfStudy}`,
      `student_details/${academicYear}/${yearOfStudy}`
    ];

    // Try the first path structure first (original project path)
    let path = paths[0];

    // Use a single request with a high limit for better performance
    const PAGINATION_LIMIT = 10000; // Use a higher limit for faster retrieval
    let allItems: any[] = [];

    // First try the original path structure (faster)
    const { data: items, error } = await supabase.storage
      .from('student_data')
      .list(path, {
        limit: PAGINATION_LIMIT,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      // If the first path fails, try the second path
      path = paths[1];
      const { data: alternativeItems, error: alternativeError } = await supabase.storage
        .from('student_data')
        .list(path, {
          limit: PAGINATION_LIMIT,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (alternativeError) {
        return {
          success: false,
          error: alternativeError.message,
          details: `Failed to list roll numbers for both path structures`
        };
      }

      // Use the items from the alternative path
      if (alternativeItems && alternativeItems.length > 0) {
        allItems = alternativeItems;
      }
    } else {
      // Use the items from the first path
      if (items && items.length > 0) {
        allItems = items;
      }
    }

    // Filter to only include folders (not files) that look like roll numbers
    const rollNumbers = allItems
      .filter(item => !item.name.includes('.') && /^\d{2}[A-Z0-9]+$/.test(item.name))
      .map(item => item.name)
      .sort();

    return {
      success: true,
      rollNumbers,
      message: `Found ${rollNumbers.length} roll numbers for ${path}`
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      details: `An unexpected error occurred while listing roll numbers for ${academicYear}/${yearOfStudy}`
    };
  }
}
