/**
 * Formats a number as Bangladeshi Taka (BDT)
 * Uses the Indian numbering system (e.g., 1,00,000) which is standard in Bangladesh
 * 
 * @param amount - The numerical value to format
 * @param includeSymbol - Whether to include the ৳ symbol (default: true)
 * @returns Formatted string
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);

  if (!includeSymbol) {
    return formatted.replace("BDT", "").trim();
  }

  // Replace 'BDT' code with the '৳' symbol if the formatter uses the code
  return formatted.replace("BDT", "৳").trim();
};

/**
 * Formats a number with commas in the BDT style but without the currency symbol
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
