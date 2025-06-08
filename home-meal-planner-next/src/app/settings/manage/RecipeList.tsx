import { Recipe } from "../../recipes";
import { Button } from "../../components/Button";

export default function RecipeList({ recipes, onEdit, onDelete }: {
  recipes: Recipe[];
  onEdit: (r: Recipe) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
      {recipes.map(recipe => (
        <div
          key={recipe.id}
          className="bg-white rounded shadow p-4 flex flex-col sm:w-[300px] w-full"
        >
          <div className="font-bold text-lg mb-2">{recipe.title}</div>
          <div className="mb-1">
            <span className="font-semibold">Ainekset:</span> {recipe.contents.join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Linkit:</span> {recipe.links.join(", ")}
          </div>
          <div className="flex gap-2 mt-auto">
            <Button onClick={() => onEdit(recipe)}>Muokkaa</Button>
            <button
              className="text-red-600 hover:underline ml-2"
              onClick={() => onDelete(recipe.id)}
              type="button"
            >Poista</button>
          </div>
        </div>
      ))}
    </div>
  );
} 