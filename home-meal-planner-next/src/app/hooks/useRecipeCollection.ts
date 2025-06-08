import { useState, useEffect, useCallback } from "react";
import { Recipe, recipes as staticRecipes } from "../recipes";

const arrayToRecord = (recipes: Recipe[]): Record<string, Recipe> => {
    return recipes.reduce((acc, recipe) => {
        acc[recipe.id] = recipe;
        return acc;
    }, {} as Record<string, Recipe>);
};

export function useRecipeCollection() {
  const [recipeCollection, setRecipeCollection] = useState<Record<string, Recipe>>({});

  useEffect(() => {
    const savedRecipes = localStorage.getItem("recipeCollection");
    let shouldInit = false;
    let parsed: Record<string, Recipe> = {};
    if (savedRecipes) {
      try {
        parsed = JSON.parse(savedRecipes);
        // If parsed is empty object or array, treat as uninitialized
        if (!parsed || (Array.isArray(parsed) && parsed.length === 0) || (typeof parsed === 'object' && Object.keys(parsed).length === 0)) {
          shouldInit = true;
        }
      } catch {
        shouldInit = true;
      }
    } else {
      shouldInit = true;
    }
    if (shouldInit) {
      const initial = arrayToRecord(staticRecipes);
      localStorage.setItem("recipeCollection", JSON.stringify(initial));
      setRecipeCollection(initial);
    } else {
      setRecipeCollection(parsed);
    }
  }, []);

  const save = useCallback(() => {
    localStorage.setItem("recipeCollection", JSON.stringify(recipeCollection));
  }, [recipeCollection]);

  return {
    recipeCollection,
    setRecipeCollection,
    save,
  };
} 