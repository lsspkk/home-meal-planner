import { useState } from "react";

export default function IngredientInput({ ingredients, setIngredients }: {
  ingredients: string[];
  setIngredients: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === "Tab") && input.trim()) {
      e.preventDefault();
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Ainekset</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {ingredients.map((ing, i) => (
          <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs flex items-center">
            {ing}
            <button
              type="button"
              className="ml-1 text-red-500"
              onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
              aria-label="Poista"
            >×</button>
          </span>
        ))}
      </div>
      <input
        className="w-full border p-2 rounded"
        placeholder="Lisää ainesosa ja paina Enter tai Tab"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
} 