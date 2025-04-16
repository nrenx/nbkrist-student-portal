/**
 * Utility functions to process student data
 */

/**
 * Process mid-term marks data to separate subjects and labs
 * @param midMarks - The raw mid-marks data from Supabase
 * @returns Processed mid-marks with subjects and labs arrays
 */
export function processMidMarks(midMarks: any) {
  if (!midMarks) return null;
  
  // Create a processed version of mid marks
  const processedMidMarks = {
    subjects: [] as any[],
    labs: [] as any[],
    metadata: midMarks._metadata || {},
    branch: midMarks.branch,
    section: midMarks.section,
    semester: midMarks.semester,
    data_type: midMarks.data_type,
    roll_number: midMarks.roll_number,
    academic_year: midMarks.academic_year,
    last_updated: midMarks.last_updated
  };
  
  // Check if we already have a nested structure with subjects and labs
  if (midMarks.subjects && midMarks.labs) {
    // Already in the right format, just convert to arrays
    processedMidMarks.subjects = Object.entries(midMarks.subjects).map(([name, data]: [string, any]) => ({
      name,
      mid1: data.mid1 || null,
      mid2: data.mid2 || null,
      total: data.total || null
    }));
    
    processedMidMarks.labs = Object.entries(midMarks.labs).map(([name, total]: [string, any]) => ({
      name,
      total: total
    }));
    
    return processedMidMarks;
  }
  
  // Get all keys from mid_marks (excluding metadata and known non-subject fields)
  const excludedKeys = [
    '_metadata', 'branch', 'section', 'semester', 'data_type', 
    'roll_number', 'academic_year', 'last_updated', 'subjects', 'labs'
  ];
  
  const allKeys = Object.keys(midMarks).filter(key => !excludedKeys.includes(key));
  
  // First, identify all unique subject base names and lab names
  const subjectBaseNames = new Set<string>();
  const labNames = new Set<string>();
  
  allKeys.forEach(key => {
    if (
      key.toUpperCase().includes('LAB') || 
      key.toUpperCase().includes('WORKSHOP') || 
      key.toUpperCase().includes('PRACTICAL')
    ) {
      // It's a lab
      labNames.add(key);
    } else if (key.includes('_mid1') || key.includes('_mid2')) {
      // It's a subject with mid1/mid2 breakdown
      const baseName = key.replace('_mid1', '').replace('_mid2', '');
      subjectBaseNames.add(baseName);
    } else {
      // It might be a subject total or a subject without breakdown
      subjectBaseNames.add(key);
    }
  });
  
  // Process subjects
  subjectBaseNames.forEach(baseName => {
    const subject = {
      name: baseName,
      mid1: midMarks[`${baseName}_mid1`] || null,
      mid2: midMarks[`${baseName}_mid2`] || null,
      total: midMarks[baseName] || null
    };
    
    processedMidMarks.subjects.push(subject);
  });
  
  // Process labs
  labNames.forEach(labName => {
    const lab = {
      name: labName,
      total: midMarks[labName] || null
    };
    
    processedMidMarks.labs.push(lab);
  });
  
  return processedMidMarks;
}
