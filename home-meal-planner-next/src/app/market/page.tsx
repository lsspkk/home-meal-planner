"use client";
import { useWeekMenus } from "../hooks/useWeekMenus";
import { useRecipeCollection } from "../hooks/useRecipeCollection";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { recipes as staticRecipes, Recipe } from "../recipes";

// Regex patterns to remove quantities and units from ingredient strings for sorting/grouping
const QUANTITY_REGEXES = [
  // Remove leading numbers (optionally with decimal, range, or fraction) and units, e.g. "2 kg", "1.5 l", "½ l", "2-3 munaa", "400-500g"
  /^\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*/i,
  // Remove parenthesis at start or end, e.g. "(valkosipuli)", "peruna (8)"
  /^\(+|\)+$/g,
  // Remove trailing numbers and units, e.g. "perunaa 2 kpl", "peruna (8)"
  /\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*$/i,
  // Remove numbers/units inside parenthesis, e.g. "peruna (8)"
  /\(\s*(\d+[.,]?\d*|\d+\s*-\s*\d+|½|¼|¾)\s*(kg|g|l|dl|ml|tl|rkl|ps|pkt|kpl|rasia|tlk|pussi|annos|viipale|pala|levy|prk|nippu|ruukku|astia|purkki|pnt)?\s*\)/gi,
];
function stripQuantity(ingredient: string) {
  let result = ingredient;
  for (const regex of QUANTITY_REGEXES) {
    result = result.replace(regex, "");
  }
  return result.trim().toLowerCase();
}

type IngredientRecipe = {
  ingredient: string;
  recipeKey: string;
};

export default function MarketPage() {
  const searchParams = useSearchParams();
  const { selection, selectedWeek } = useWeekMenus();
  const { recipeCollection } = useRecipeCollection();
  const weekNumber = Number(searchParams.get("week")) || selectedWeek;

  // 1. Get all recipe IDs for the selected week
  const recipeIds: string[] = selection[weekNumber] || [];

  // 2. Build a map of recipeKey to recipeData
  const recipeMap: Record<string, Recipe> = {};
  recipeIds.forEach((id) => {
    const recipe = recipeCollection[id] || staticRecipes.find((r: Recipe) => r.id === id);
    if (recipe) {
      recipeMap[id] = recipe;
    }
  });

  // 3. Build IngredientRecipe[] for all ingredients in the week's recipes
  const ingredientRecipes: IngredientRecipe[] = [];
  recipeIds.forEach((id) => {
    const recipe = recipeMap[id];
    if (recipe && recipe.contents) {
      recipe.contents.forEach((ingredient) => {
        ingredientRecipes.push({ ingredient, recipeKey: id });
      });
    }
  });

  // --- Sorting logic ---
  type SortColumn = "ingredient" | "recipe";
  type SortState = { column: SortColumn; direction: "asc" | "desc" }[];
  // Default: sort by ingredient ascending
  const [sortState, setSortState] = useState<SortState>([
    { column: "ingredient", direction: "asc" },
  ]);

  function getSortIcon(col: SortColumn) {
    const idx = sortState.findIndex((s) => s.column === col);
    if (idx === -1) return null;
    return sortState[idx].direction === "asc" ? (
      <span aria-label="nouseva" className="ml-1">▲</span>
    ) : (
      <span aria-label="laskeva" className="ml-1">▼</span>
    );
  }

  function handleHeaderClick(col: SortColumn, e: React.MouseEvent) {
    setSortState((prev) => {
      const idx = prev.findIndex((s) => s.column === col);
      if (e.shiftKey) {
        // Multi-sort: toggle/add/remove
        if (idx === -1) {
          return [...prev, { column: col, direction: "asc" }];
        } else {
          // Toggle direction
          const newState = [...prev];
          newState[idx] = {
            column: col,
            direction: newState[idx].direction === "asc" ? "desc" : "asc",
          };
          return newState;
        }
      } else {
        // Single sort: toggle or set
        if (idx === -1) {
          return [{ column: col, direction: "asc" }];
        } else {
          return [{
            column: col,
            direction: prev[idx].direction === "asc" ? "desc" : "asc",
          }];
        }
      }
    });
  }

  // Sort function
  function multiSort(a: IngredientRecipe, b: IngredientRecipe) {
    for (const s of sortState) {
      let cmp = 0;
      if (s.column === "ingredient") {
        cmp = stripQuantity(a.ingredient).localeCompare(stripQuantity(b.ingredient));
      } else if (s.column === "recipe") {
        cmp = (recipeMap[a.recipeKey]?.title || "").localeCompare(recipeMap[b.recipeKey]?.title || "");
      }
      if (cmp !== 0) return s.direction === "asc" ? cmp : -cmp;
    }
    return 0;
  }

  const sortedIngredientRecipes = [...ingredientRecipes].sort(multiSort);

  const pastelColors = [
    'bg-pink-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-purple-50',
    'bg-orange-50',
    'bg-teal-50',
    'bg-indigo-50',
  ];


  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4 hidden sm:block">Viikon {weekNumber} ainekset yhdellä listalla.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-xs text-gray-400 font-normal px-2 py-1 text-left">#</th>
              <th
                className="text-xs text-gray-700 font-semibold px-2 py-1 text-left cursor-pointer select-none"
                onClick={(e) => handleHeaderClick("ingredient", e)}
              >
                Ainesosa {getSortIcon("ingredient")}
              </th>
              <th
                className="text-xs text-gray-700 font-semibold px-2 py-1 text-left cursor-pointer select-none min-w-[120px] whitespace-nowrap"
                onClick={(e) => handleHeaderClick("recipe", e)}
              >
                Resepti {getSortIcon("recipe")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedIngredientRecipes.length === 0 ? (
              <tr><td className="text-gray-500">Ei valittuja reseptejä.</td></tr>
            ) : (
              sortedIngredientRecipes.map((ir, i) => (
                <tr key={i} className={`${pastelColors[i % pastelColors.length]}`}>
                  <td className="text-xs text-gray-400 pr-2 pl-2 py-1 align-top">{i + 1}</td>
                  <td className="py-1 px-2 align-top">{ir.ingredient}</td>
                  <td className="py-1 px-2 align-top text-xs text-gray-500 whitespace-nowrap">
                    {recipeMap[ir.recipeKey]?.title.slice(0, 8) || ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 