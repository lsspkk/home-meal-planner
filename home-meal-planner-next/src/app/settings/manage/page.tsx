"use client";
import { useState } from "react";
import { useRecipeCollection } from "../../hooks/useRecipeCollection";
import { recipes as staticRecipes, Recipe } from "../../recipes";
import { Button } from "../../components/Button";
import RecipeList from "./RecipeList";
import RecipeEditModal from "./RecipeEditModal";

export default function ManagePage() {
  const { recipeCollection, setRecipeCollection, save: saveRecipes } = useRecipeCollection();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const recipes: Recipe[] = Object.values(recipeCollection).length
    ? Object.values(recipeCollection)
    : staticRecipes;

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRecipe(null);
    setModalOpen(true);
  };

  const handleSave = (recipe: Recipe) => {
    setRecipeCollection(prev => ({ ...prev, [recipe.id]: recipe }));
    saveRecipes();
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Poista resepti?")) {
      setRecipeCollection(prev => {
        const newColl = { ...prev };
        delete newColl[id];
        return newColl;
      });
      saveRecipes();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Reseptien hallinta</h1>
        <Button onClick={handleAdd} variant="primary">Lisää resepti</Button>
      </div>
      <RecipeList
        recipes={recipes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <RecipeEditModal
        open={modalOpen}
        recipe={editingRecipe}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
} 