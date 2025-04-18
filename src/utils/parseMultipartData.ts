/**
 * Utility functions for parsing multipart form data
 */

/**
 * Parse multipart form data content
 * @param content - The multipart form data content as string
 * @returns Parsed key-value pairs
 */
export function parseMultipartFormData(content: string): Record<string, string> {
  if (!content || typeof content !== 'string') {
    return {};
  }

  try {
    // First check if it's already valid JSON
    try {
      const jsonData = JSON.parse(content);
      if (typeof jsonData === 'object' && jsonData !== null) {
        return jsonData;
      }
    } catch (e) {
      // Not valid JSON, continue with multipart parsing
    }

    // Parse multipart form data
    const result: Record<string, string> = {};
    
    // Split by lines and process each line
    const lines = content.split(/\r?\n/);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Look for key-value pairs (key: value or key=value format)
      const colonMatch = line.match(/^([^:]+):\s*(.*)$/);
      if (colonMatch) {
        const [, key, value] = colonMatch;
        result[key.trim()] = value.trim();
        continue;
      }
      
      const equalsMatch = line.match(/^([^=]+)=(.*)$/);
      if (equalsMatch) {
        const [, key, value] = equalsMatch;
        result[key.trim()] = value.trim();
        continue;
      }
      
      // Handle JSON-like content within multipart data
      if (line.includes('{') && line.includes('}')) {
        try {
          // Extract JSON-like content
          const jsonMatch = line.match(/{.*}/);
          if (jsonMatch) {
            const jsonContent = jsonMatch[0];
            const jsonData = JSON.parse(jsonContent);
            
            // Merge JSON properties into result
            Object.assign(result, jsonData);
          }
        } catch (e) {
          console.warn('Failed to parse JSON-like content in multipart data:', e);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing multipart form data:', error);
    return {};
  }
}

/**
 * Extract nested data from a flat key-value structure
 * @param data - Flat key-value pairs
 * @returns Structured data with nested objects
 */
export function extractNestedData(data: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Handle nested keys (e.g., "user.name" -> { user: { name: value } })
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      current[parts[parts.length - 1]] = value;
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Process raw data that might be in multipart form format
 * @param data - Raw data that might be multipart form data
 * @returns Processed data
 */
export function processMultipartData(data: any): any {
  if (!data) return null;
  
  // If data is already an object and not a string, return it as is
  if (typeof data !== 'string' && typeof data === 'object') {
    return data;
  }
  
  // If data is a string, try to parse it as multipart form data
  if (typeof data === 'string') {
    const parsedData = parseMultipartFormData(data);
    return extractNestedData(parsedData);
  }
  
  return data;
}
