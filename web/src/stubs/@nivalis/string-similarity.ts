// Stub for @nivalis/string-similarity
export function compareTwoStrings(first: string, second: string): number {
  if (first === second) return 1;
  return 0;
}

export function findBestMatch(mainString: string, targetStrings: string[]): {
  ratings: Array<{ target: string; rating: number }>;
  bestMatch: { target: string; rating: number };
  bestMatchIndex: number;
} {
  let bestIndex = 0;
  let bestRating = 0;
  const ratings = targetStrings.map((target, i) => {
    const rating = compareTwoStrings(mainString, target);
    if (rating > bestRating) { bestRating = rating; bestIndex = i; }
    return { target, rating };
  });
  return { ratings, bestMatch: ratings[bestIndex], bestMatchIndex: bestIndex };
}
