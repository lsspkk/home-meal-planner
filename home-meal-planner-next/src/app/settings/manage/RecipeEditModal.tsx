import { useState, useEffect } from "react";
import { Recipe } from "../../recipes";
import { Button } from "../../components/Button";
import IngredientInput from "./IngredientInput";
import { Modal } from "../../components/Modal";
import React from "react";

export default function RecipeEditModal({ open, recipe, onClose, onSave }: {
  open: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (r: Recipe) => void;
}) {
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    setTitle(recipe?.title || "");
    setLinks(recipe?.links.join(", ") || "");
    setIngredients(recipe?.contents || []);
  }, [recipe, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: recipe?.id || Math.random().toString(36).slice(2, 10),
      title,
      links: links.split(",").map(s => s.trim()).filter(Boolean),
      contents: ingredients,
      text: recipe?.text || "",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form
        className="w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-2">{recipe ? "Muokkaa reseptiä" : "Lisää resepti"}</h2>
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Nimi"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Linkit (pilkulla eroteltuna)"
          value={links}
          onChange={e => setLinks(e.target.value)}
        />
        <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Peruuta</Button>
          <Button type="submit" variant="primary">{recipe ? "Tallenna" : "Lisää"}</Button>
        </div>
      </form>
    </Modal>
  );
} 