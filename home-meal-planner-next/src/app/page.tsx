import { WeekSelector } from "./components/WeekSelector";
import { WeekSelectorView } from "./components/WeekSelectorView";
import { useWeeklySelection } from "./useWeeklySelection";
import { recipes } from "./recipes";
import { getWeeksInRange } from "./utils";

export default function HomePage() {
  const {
    selectedWeek,
    setSelectedWeek,
    selection,
    setSelection,
    addRecipeToDay,
    removeRecipeFromDay,
    clearDay,
    clearAll,
  } = useWeeklySelection();

  // Calculate weeks for the next 2 months
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  const weeks = getWeeksInRange(today, twoMonthsLater);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Viikon ruokalista</h1>
      <p className="text-gray-600 mb-4">Valitse viikko ja suunnittele ateriat. Klikkaa reseptiä lisätäksesi sen päivälle.</p>
      <WeekSelector
        weeks={weeks}
        recipes={recipes}
        layout="vertical"
      />
      <WeekSelectorView
        weeks={weeks}
        recipes={recipes}
        selected={selection}
        onAdd={addRecipeToDay}
        onRemove={removeRecipeFromDay}
        onView={() => {}}
        modalRecipe={null}
        modalOpen={false}
        closeModal={() => {}}
        openAccordionIdx={null}
        setOpenAccordionIdx={() => {}}
        layout="vertical"
        selectedWeekIdx={selectedWeek}
        onPrevWeek={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
        onNextWeek={() => setSelectedWeek(selectedWeek + 1)}
      />
    </div>
  );
} 