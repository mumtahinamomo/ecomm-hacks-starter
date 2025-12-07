export type Size = "XS" | "S" | "M" | "L" | "XL";

export interface SizeRange {
  size: Size;
  waistMin: number;
  waistMax: number;
  hipMin: number;
  hipMax: number;
}

export const sizeRanges: SizeRange[] = [
  { size: "XS", waistMin: 0, waistMax: 25, hipMin: 0, hipMax: 35 },
  { size: "S", waistMin: 25, waistMax: 27, hipMin: 35, hipMax: 37 },
  { size: "M", waistMin: 28, waistMax: 30, hipMin: 38, hipMax: 40 },
  { size: "L", waistMin: 31, waistMax: 33, hipMin: 41, hipMax: 43 },
  { size: "XL", waistMin: 33, waistMax: 100, hipMin: 43, hipMax: 100 },
];

export const calculateRecommendedSize = (
  waist?: number,
  hip?: number
): Size | null => {
  if (!waist && !hip) return null;

  // If we only have waist
  if (waist && !hip) {
    if (waist < 25) return "XS";
    if (waist <= 27) return "S";
    if (waist <= 30) return "M";
    if (waist <= 33) return "L";
    return "XL";
  }

  // If we only have hip
  if (!waist && hip) {
    if (hip < 35) return "XS";
    if (hip <= 37) return "S";
    if (hip <= 40) return "M";
    if (hip <= 43) return "L";
    return "XL";
  }

  // If we have both, find the best match
  if (waist && hip) {
    for (const range of sizeRanges) {
      const waistInRange = waist >= range.waistMin && waist <= range.waistMax;
      const hipInRange = hip >= range.hipMin && hip <= range.hipMax;
      if (waistInRange && hipInRange) {
        return range.size;
      }
    }
    // If no exact match, base on waist (more restrictive for fit)
    if (waist < 25) return "XS";
    if (waist <= 27) return "S";
    if (waist <= 30) return "M";
    if (waist <= 33) return "L";
    return "XL";
  }

  return null;
};
