"use client";
import { useState } from "react";
import { useRecipeCollection } from "../../hooks/useRecipeCollection";
import { Button } from "../../components/Button";
import RecipeList from "./RecipeList";
import RecipeEditModal from "./RecipeEditModal";
import { Recipe } from "../../recipes";

export default function ManagePage() {
  const { recipeCollection, save: saveRecipes } = useRecipeCollection();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const recipes: Recipe[] = Object.values(recipeCollection);

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRecipe(null);
    setModalOpen(true);
  };

  const handleSave = (recipe: Recipe) => {
    const newCollection = { ...recipeCollection, [recipe.id]: recipe };
    saveRecipes(newCollection);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Poista resepti?")) {
      const newCollection = { ...recipeCollection };
      delete newCollection[id];
      saveRecipes(newCollection);
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