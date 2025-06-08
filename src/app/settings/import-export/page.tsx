// Removed unused imports and fixed Link import if not used
// ... existing code ... 

// Load current
const currentWeeks: Record<string, string[]> = JSON.parse(localStorage.getItem("weeklySelection") || "{}") || {};
let allRecipes: Recipe[] = JSON.parse(localStorage.getItem("allRecipes") || "[]");
const recipeIds = new Set(allRecipes.map(r => r.id));
let imported = 0;
let newRecipes = 0;
let duplicateWeekly = 0;
let duplicateRecipes = 0;

for (const week of data.weeks) {
  const idx = week.idx !== undefined ? week.idx : null;
  // Find the week index by weekNumber if idx is not present
  const weekIdx = idx !== null ? idx : week.weekNumber - 1;
  if (!currentWeeks[weekIdx]) currentWeeks[weekIdx] = [];
  for (const rid of week.recipes) {
    const ridStr = String(rid);
    if (!currentWeeks[weekIdx].includes(ridStr)) {
      currentWeeks[weekIdx].push(ridStr);
      imported++;
    } else {
      duplicateWeekly++;
    }
  }
}

// ... existing code ... 