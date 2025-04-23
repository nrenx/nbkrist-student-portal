/**
 * Utility functions to mask sensitive data
 */

/**
 * Masks an Aadhaar number, showing only the last 4 digits
 * @param aadhaar - The Aadhaar number to mask
 * @returns Masked Aadhaar number with only last 4 digits visible
 */
export function maskAadhaar(aadhaar: string | null | undefined): string {
  if (!aadhaar) return '';

  // If it's already masked (contains asterisks), return as is
  if (aadhaar.includes('*')) return aadhaar;

  // Remove any non-alphanumeric characters (like spaces, dashes)
  const cleanAadhaar = aadhaar.replace(/[^a-zA-Z0-9]/g, '');

  // Check if we have a valid length (Aadhaar is typically 12 digits)
  if (cleanAadhaar.length < 4) return cleanAadhaar;

  // Get the last 4 digits
  const lastFourDigits = cleanAadhaar.slice(-4);

  // Replace all other digits with asterisks
  const maskedPart = '*'.repeat(cleanAadhaar.length - 4);

  // Preserve original formatting if possible
  if (aadhaar.includes('-') || aadhaar.includes(' ')) {
    // Try to maintain the original format (with dashes or spaces)
    const originalFormat = aadhaar;
    const lastFourPos = originalFormat.length - 4;

    // If the original has separators and is long enough
    if (lastFourPos > 0) {
      // Keep the last 4 characters and replace the rest with asterisks
      // while preserving any separators
      let result = '';
      for (let i = 0; i < originalFormat.length - 4; i++) {
        const char = originalFormat[i];
        result += /[0-9a-zA-Z]/.test(char) ? '*' : char;
      }
      return result + originalFormat.slice(originalFormat.length - 4);
    }
  }

  // Format with dashes for better readability (XXXX-XXXX-1234)
  if (cleanAadhaar.length === 12) {
    return `${maskedPart.slice(0, 4)}-${maskedPart.slice(4, 8)}-${lastFourDigits}`;
  }

  // For non-standard lengths, just concatenate
  return maskedPart + lastFourDigits;
}
