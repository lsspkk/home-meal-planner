import { useState } from "react";
import { useWeeklySelection } from "../../useWeeklySelection";

export default function ImportExportPage() {
  const { selection, setSelection } = useWeeklySelection();
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState("");

  const handleExport = () => {
    const data = JSON.stringify(selection, null, 2);
    navigator.clipboard.writeText(data);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importValue);
      if (typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      setSelection(parsed);
      setImportError("");
    } catch {
      setImportError("Virheellinen JSON-muoto.");
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Tuo tai vie valinnat</h1>
      <p className="text-gray-600 mb-4">Voit varmuuskopioida viikon valinnat tai tuoda ne toisesta laitteesta.</p>
      <button onClick={handleExport} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Kopioi valinnat JSONina</button>
      <div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={6}
          placeholder="Liitä JSON tähän tuodaksesi valinnat..."
          value={importValue}
          onChange={e => setImportValue(e.target.value)}
        />
        <button onClick={handleImport} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Tuo valinnat</button>
        {importError && <div className="text-red-500 mt-2">{importError}</div>}
      </div>
    </div>
  );
} 