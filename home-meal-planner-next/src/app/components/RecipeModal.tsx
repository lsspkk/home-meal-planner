import { Recipe } from "../recipes";

interface RecipeModalProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipe, open, onClose }: RecipeModalProps) {
  if (!open || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Sulje"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2">{recipe.title}</h2>
        <div className="text-sm text-gray-600 mb-2">{recipe.text}</div>
        {recipe.links.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-xs mb-1">Linkit:</div>
            <ul className="list-disc ml-5">
              {recipe.links.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="font-semibold text-xs mb-1">Sisältö:</div>
        <ul className="list-disc ml-5">
          {recipe.contents.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 