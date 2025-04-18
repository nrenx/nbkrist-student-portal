# Supabase Storage Setup Guide

This guide explains how to set up your Supabase project for the NBKRIST Student Portal and provides implementation details.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project with a name of your choice
3. Note down your project URL and anon/public key (found in Project Settings > API)

## 2. Set Up Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `student_data` (or a name of your choice)
3. Set the bucket's privacy to "Private" (recommended for student data)
4. Configure CORS if needed (for production environments)

## 3. Set Up Storage Structure

Create the following folder structure in your bucket:

```
student_data/
├── {academic_year}/
│   ├── {year_of_study}/
│   │   ├── rollIndex.json (optional)
│   │   ├── {branch}/
│   │   │   ├── {section}/
│   │   │   │   ├── {roll_number}/
│   │   │   │   │   ├── personal_details.json
│   │   │   │   │   ├── attendance.json
│   │   │   │   │   └── mid_marks.json
```

For example:
```
student_data/
├── 2023-24/
│   ├── 1/
│   │   ├── rollIndex.json
│   │   ├── CSE/
│   │   │   ├── A/
│   │   │   │   ├── 23KB1A0501/
│   │   │   │   │   ├── personal_details.json
│   │   │   │   │   ├── attendance.json
│   │   │   │   │   └── mid_marks.json
```

## 4. File Formats

### rollIndex.json (Optional)

This file maps roll numbers to their branch and section. If not provided, the system will try to extract branch information from the roll number pattern.

```json
{
  "23KB1A0501": {
    "branch": "CSE",
    "section": "A"
  },
  "23KB1A0502": {
    "branch": "CSE",
    "section": "A"
  }
}
```

### personal_details.json

```json
{
  "Name": "Student Name",
  "Roll No": "23KB1A0501",
  "Father Name": "Father's Name",
  "Parent Mobile": "9876543210",
  "Student Mobile": "9876543211",
  "Aadhaar": "XXXX-XXXX-XXXX"
}
```

### attendance.json

```json
{
  "attendance_percentage": "85.5%",
  "total_classes": "120",
  "Subject 1": "90%",
  "Subject 2": "82%",
  "Subject 3": "88%"
}
```

### mid_marks.json

```json
{
  "subjects": {
    "Subject 1": {
      "mid1": "25",
      "mid2": "28",
      "total": "53"
    },
    "Subject 2": {
      "mid1": "22",
      "mid2": "24",
      "total": "46"
    }
  },
  "labs": {
    "Lab 1": "48",
    "Lab 2": "45"
  },
  "branch": "CSE",
  "section": "A",
  "semester": "1-1",
  "roll_number": "23KB1A0501",
  "academic_year": "2023-24"
}
```

## 5. Environment Variables

Update your `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_KEY=your_supabase_anon_key_here
VITE_SUPABASE_STORAGE_BUCKET=student_data
```

## 6. Implementation Details

### Changes Made

1. **Created a new Supabase configuration**
   - Added a configuration file at `src/config/supabase.ts`
   - Implemented environment variable support with fallbacks
   - Added bucket existence checking on startup

2. **Updated Supabase client initialization**
   - Improved error handling in `src/lib/supabase.ts`
   - Added support for multiple initialization methods
   - Implemented bucket existence checking

3. **Created a new storage-based data service**
   - Implemented `src/services/studentStorageService.ts` for fetching data from Supabase Storage
   - Added support for multiple path resolution strategies
   - Implemented caching to reduce API calls
   - Added robust error handling

4. **Added multipart form data parsing**
   - Created utility functions in `src/utils/parseMultipartData.ts`
   - Added support for parsing different data formats
   - Implemented nested data extraction

5. **Updated the existing student service**
   - Modified `src/services/studentService.ts` to use the new storage-based implementation
   - Maintained the same API for backward compatibility

### Data Flow

1. User enters roll number, academic year, and year-semester
2. The application calls `fetchStudentDetails` in `studentService.ts`
3. This function delegates to `fetchStudentDetailsFromStorage` in `studentStorageService.ts`
4. The storage service:
   - Determines the branch and section using `rollIndex.json` or by extracting from the roll number pattern
   - Constructs possible paths for the student data
   - Attempts to download the data files from each path
   - Parses the data, handling both JSON and multipart form data
   - Processes the data into a format compatible with the UI components
   - Returns the processed data or null if not found
5. The UI components display the data to the user

### Error Handling

The implementation includes comprehensive error handling:

- Network errors are caught and logged
- Missing files are handled gracefully
- Invalid data formats are detected and alternative parsing methods are attempted
- User-friendly error messages are displayed when data is not found

### Performance Optimizations

- Implemented caching to reduce API calls
- Added support for environment variable configuration of cache settings
- Used efficient path resolution strategies to minimize storage operations

## 7. Testing

After setting up your Supabase project and uploading some test data, you can test the integration by:

1. Running the application locally
2. Searching for a student using their roll number, academic year, and year-semester
3. Verifying that the data is displayed correctly

## 8. Troubleshooting

- Check browser console for error messages
- Verify that your Supabase URL and key are correct
- Ensure the storage bucket exists and is accessible
- Confirm that the file paths match the expected structure
- Validate your JSON files for correct formatting

## 9. Future Improvements

Potential future improvements include:

- Adding support for more data formats
- Implementing more sophisticated caching strategies
- Adding analytics for monitoring data access patterns
- Implementing export functionality (PDF, CSV)
- Adding more user controls for data display preferences
