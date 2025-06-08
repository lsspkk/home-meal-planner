"use client";
import { useState } from "react";
import { useWeekMenus } from "../../hooks/useWeekMenus";
import { useRecipeCollection } from "../../hooks/useRecipeCollection";
import { Button } from "../../components/Button";

export default function ImportExportPage() {
  const { selection, setSelection, save: saveMenus } = useWeekMenus();
  const { recipeCollection, setRecipeCollection, save: saveRecipes } = useRecipeCollection();
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState("");
  const [results, setResults] = useState("");

  const handleExport = () => {
    const data = JSON.stringify({ weeklyMenus: selection, recipeCollection }, null, 2);
    navigator.clipboard.writeText(data);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importValue);
      if (
        typeof parsed !== "object" ||
        Array.isArray(parsed) ||
        !parsed.weeklyMenus ||
        !parsed.recipeCollection
      ) throw new Error();
      setSelection(parsed.weeklyMenus);
      setRecipeCollection(parsed.recipeCollection);
      saveMenus();
      saveRecipes();
      setResults("Tiedot tuotu onnistuneesti!");
      setImportError("");
    } catch {
      setImportError("Virheellinen JSON-muoto tai puuttuvat kentät (weeklyMenus, recipeCollection).");
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Tuo tai vie valinnat</h1>
      <p className="text-gray-600 mb-4">Voit varmuuskopioida viikon valinnat ja reseptit tai tuoda ne toisesta laitteesta.</p>
      <Button onClick={handleExport} variant="primary" className="mb-4">Kopioi valinnat JSONina</Button>
      <div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={6}
          placeholder="Liitä JSON tähän tuodaksesi valinnat..."
          value={importValue}
          onChange={e => setImportValue(e.target.value)}
        />
        <Button onClick={handleImport} variant="secondary">Tuo valinnat</Button>
        {importError && <div className="text-red-500 mt-2">{importError}</div>}
      </div>
      {results && <div className="text-green-500 mt-2">{results}</div>}
    </div>
  );
} 