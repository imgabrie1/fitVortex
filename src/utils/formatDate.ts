export const formatDateToDDMMYYYY = (date: Date | string): string => {
  if (!date) return "";

  if (typeof date === "string") {
    const parts = date.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Assuming the string is YYYY-MM-DD and doesn't need parsing, just reformatting
      if (year.length === 4) {
        return `${day}-${month}-${year}`;
      }
    }
  }

  // Fallback for Date objects or other string formats
  const d = new Date(date);
  // Using UTC methods to avoid timezone-related off-by-one day errors
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
};