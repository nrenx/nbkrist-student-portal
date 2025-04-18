# Supabase Storage Setup Guide

This guide explains how to set up your Supabase project for the NBKRIST Student Portal.

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

## 6. Testing

After setting up your Supabase project and uploading some test data, you can test the integration by:

1. Running the application locally
2. Searching for a student using their roll number, academic year, and year-semester
3. Verifying that the data is displayed correctly

## Troubleshooting

- Check browser console for error messages
- Verify that your Supabase URL and key are correct
- Ensure the storage bucket exists and is accessible
- Confirm that the file paths match the expected structure
- Validate your JSON files for correct formatting
