"use client";
import { useState, useMemo } from "react";
import { useWeeklyMenus } from "../../hooks/useWeekMenus";
import { useRecipeCollection } from "../../hooks/useRecipeCollection";
import { Button } from "../../components/Button";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Recipe } from "../../recipes";
import React from "react";

type Mode = "import" | "export" | null;

interface ImportAnalysis {
  newRecipes: Recipe[];
  updatedRecipes: Recipe[];
  newWeeks: string[];
  updatedWeeks: string[];
  hasChanges: boolean;
  error?: string;
}

// Helper to compare recipe contents regardless of order
const compareContents = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return JSON.stringify(sortedA) === JSON.stringify(sortedB);
};

export default function ImportExportPage() {
  const { weeklyMenus, save: saveMenus } = useWeeklyMenus();
  const { recipeCollection, save: saveRecipes } = useRecipeCollection();
  
  const [mode, setMode] = useState<Mode>(null);
  const [importValue, setImportValue] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const handleExport = () => {
    const data = JSON.stringify({ weeklyMenus, recipeCollection }, null, 2);
    navigator.clipboard.writeText(data);
    setImportStatus("Tiedot kopioitu leikepöydälle!");
    setTimeout(() => setImportStatus(""), 3000);
  };

  const analysis: ImportAnalysis | null = useMemo(() => {
    if (mode !== 'import' || !importValue) return null;
    try {
      const parsed = JSON.parse(importValue);
      if (!parsed.weeklyMenus || !parsed.recipeCollection) {
        throw new Error("JSON-datasta puuttuu vaaditut kentät: 'weeklyMenus' ja 'recipeCollection'.");
      }

      const parsedRecipes = parsed.recipeCollection as Record<string, Recipe>;
      const parsedMenus = parsed.weeklyMenus as Record<string, string[]>;

      const newRecipes = Object.values(parsedRecipes).filter(r => !recipeCollection[r.id]);
      const updatedRecipes = Object.values(parsedRecipes).filter(r => 
        recipeCollection[r.id] && !compareContents(recipeCollection[r.id].contents, r.contents)
      );

      const newWeeks = Object.keys(parsedMenus).filter(week => !weeklyMenus[week]);
      const updatedWeeks = Object.keys(parsedMenus).filter(week => {
        if (!weeklyMenus[week]) return false;
        const existingMenus = new Set(weeklyMenus[week]);
        return parsedMenus[week].some(menuId => !existingMenus.has(menuId));
      });

      const hasChanges = newRecipes.length > 0 || updatedRecipes.length > 0 || newWeeks.length > 0 || updatedWeeks.length > 0;

      return { newRecipes, updatedRecipes, newWeeks, updatedWeeks, hasChanges };
    } catch (e) {
      const error = e instanceof Error ? e.message : "Virheellinen JSON-muoto.";
      return { 
        newRecipes: [], updatedRecipes: [], newWeeks: [], updatedWeeks: [], hasChanges: false, 
        error
      };
    }
  }, [importValue, recipeCollection, weeklyMenus, mode]);

  const handleImport = () => {
    if (!analysis || !analysis.hasChanges || analysis.error) return;

    const parsed = JSON.parse(importValue);
    
    // Merge recipes
    const newRecipeCollection = { ...recipeCollection };
    analysis.newRecipes.forEach(r => newRecipeCollection[r.id] = r);
    analysis.updatedRecipes.forEach(r => newRecipeCollection[r.id] = r);
    saveRecipes(newRecipeCollection);

    // Merge weekly menus
    const newWeeklyMenus = { ...weeklyMenus };
    for (const week in parsed.weeklyMenus) {
      if (newWeeklyMenus[week]) {
        const existingMenus = new Set(newWeeklyMenus[week]);
        newWeeklyMenus[week] = [
          ...newWeeklyMenus[week],
          ...parsed.weeklyMenus[week].filter((menu: string) => !existingMenus.has(menu)),
        ];
      } else {
        newWeeklyMenus[week] = [...parsed.weeklyMenus[week]];
      }
    }
    saveMenus(newWeeklyMenus);

    setImportStatus("Tietojen tuonti onnistui!");
    setImportValue("");
    setMode(null);
    setTimeout(() => setImportStatus(""), 3000);
  };
  
  const exportStats = useMemo(() => {
    const recipeCount = Object.keys(recipeCollection).length;
    const weekCount = Object.keys(weeklyMenus).length;
    const totalMenus = Object.values(weeklyMenus).flat().length;
    const totalIngredients = Object.values(recipeCollection).flatMap(r => r.contents).length;
    return { recipeCount, weekCount, totalMenus, totalIngredients };
  }, [recipeCollection, weeklyMenus]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Tuo ja vie tiedot</h1>
        <p className="text-gray-600 mt-2">
          Täällä voit varmuuskopioida reseptisi ja viikottaiset ruokalistasi, tai siirtää ne toiselle laitteelle.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={() => setMode('export')} variant={mode === 'export' ? 'primary' : 'secondary'}>
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          Vie tiedot
        </Button>
        <Button onClick={() => setMode('import')} variant={mode === 'import' ? 'primary' : 'secondary'}>
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Tuo tiedot
        </Button>
      </div>

      {importStatus && (
        <div className="p-4 rounded-md bg-green-50 text-green-700 flex items-center">
          <CheckCircleIcon className="w-6 h-6 mr-3" />
          {importStatus}
        </div>
      )}

      {mode === 'export' && (
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Nykyiset tiedot</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Reseptejä:</strong> {exportStats.recipeCount}</p>
            <p><strong>Viikkoja suunniteltu:</strong> {exportStats.weekCount}</p>
            <p><strong>Ruokalistoja yhteensä:</strong> {exportStats.totalMenus}</p>
            <p><strong>Ainesosia yhteensä:</strong> {exportStats.totalIngredients}</p>
          </div>
          <pre className="w-full bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-64">
            <code>{JSON.stringify({ weeklyMenus, recipeCollection }, null, 2)}</code>
          </pre>
          <Button onClick={handleExport} variant="primary">
            <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
            Kopioi leikepöydälle
          </Button>
        </div>
      )}

      {mode === 'import' && (
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Tuo tiedot liittämällä</h2>
          <textarea
            className="w-full border rounded p-2 text-sm font-mono"
            rows={10}
            placeholder="Liitä JSON-data tähän..."
            value={importValue}
            onChange={e => setImportValue(e.target.value)}
          />
          {analysis && (
            <div className="space-y-4">
              {analysis.error && (
                 <div className="p-4 rounded-md bg-red-50 text-red-700 flex items-start">
                   <ExclamationTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                   <div>
                     <h3 className="font-bold">Virheellinen data</h3>
                     <p className="text-sm">{analysis.error}</p>
                   </div>
                 </div>
              )}
              {!analysis.error && (
                <div className="p-4 rounded-md bg-blue-50 text-blue-700">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Analyysin tulokset</h3>
                      {analysis.hasChanges ? (
                        <ul className="list-disc list-inside text-sm mt-2">
                          {analysis.newRecipes.length > 0 && <li>Löytyi {analysis.newRecipes.length} uutta reseptiä.</li>}
                          {analysis.updatedRecipes.length > 0 && <li>Löytyi {analysis.updatedRecipes.length} päivitettävää reseptiä.</li>}
                          {analysis.newWeeks.length > 0 && <li>Löytyi {analysis.newWeeks.length} uutta viikkoa.</li>}
                          {analysis.updatedWeeks.length > 0 && <li>Löytyi {analysis.updatedWeeks.length} päivitettävää viikkoa.</li>}
                        </ul>
                      ) : (
                        <p className="text-sm mt-2">Ei uusia tai muutettuja tietoja tuotavaksi.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={handleImport} variant="primary" disabled={!analysis.hasChanges || !!analysis.error}>
                Suorita tuonti
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 