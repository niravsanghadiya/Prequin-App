
/**
 * Formats a large number into a currency string with a 'B' for billions
 * or 'M' for millions. Matches the format in the UI mockup (e.g., £2.4B, £200M).
 * @param value The number to format.
 * @returns A formatted string.
 */
export const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 1_000_000_000) {
      // Format as billions with one decimal place
      return `£${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
      // Format as millions with no decimal places
      return `£${(value / 1_000_000).toFixed(0)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      // Format as thousands
      return `£${(value / 1_000).toFixed(0)}K`;
    }
    // Return the plain number for smaller values
    return `£${value}`;
  };