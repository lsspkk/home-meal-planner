import { useWeeklySelection } from "../useWeeklySelection";
import { recipes } from "../recipes";

function getShoppingList(selection: Record<string, string[]>) {
  const items = new Set<string>();
  Object.values(selection).forEach((ids) => {
    ids.forEach((id) => {
      const recipe = recipes.find((r) => r.id === id);
      if (recipe) {
        recipe.contents.forEach((item) => items.add(item));
      }
    });
  });
  return Array.from(items);
}

export default function MarketPage() {
  const { selection } = useWeeklySelection();
  const shoppingList = getShoppingList(selection);

  const handleCopy = () => {
    navigator.clipboard.writeText(shoppingList.join("\n"));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Ostoslista</h1>
      <p className="text-gray-600 mb-4">Kaikki viikon reseptien ainekset yhdellä listalla.</p>
      <button onClick={handleCopy} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Kopioi lista</button>
      <ul className="list-disc ml-6">
        {shoppingList.length === 0 ? (
          <li className="text-gray-500">Ei valittuja reseptejä.</li>
        ) : (
          shoppingList.map((item, i) => <li key={i}>{item}</li>)
        )}
      </ul>
    </div>
  );
} 