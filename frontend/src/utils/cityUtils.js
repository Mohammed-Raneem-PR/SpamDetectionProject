// Standardize city names into Title Case and trim whitespace
// so "b" and "B" -> "B", "bangalore" and "Bangalore" -> "Bangalore"
export const normalizeCity = (city) => {
  if (!city || typeof city !== "string" || !city.trim()) return "Unknown";
  return city
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

