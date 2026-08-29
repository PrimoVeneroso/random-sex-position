import Switch from "react-switch";
import { useActions } from "@/hooks";
import { SEX_LEVELS } from "@/constants";

export function Filters() {
  const { filters, setFilter, resetFilters, positionId } = useActions();

  const extraFilters = {
    FAVORITES: "Favorites Only",
    ANAL: "Anal",
    VAGINAL: "Vaginal",
    ORAL: "Oral",
    ALREADY_DONE: "Already Done"
  };

  const disabledResetButton = positionId === 0 && filters.length === 0;

  return (
    <div className="w-full z-10 flex flex-col gap-3 text-slate-700 rounded-md bg-slate-100/10 backdrop-blur-sm dark:text-white p-5 shadow-md">
      <h5 className="text-md text-center font-bold mb-1">Filter positions</h5>

      <label className="cursor-pointer flex items-center justify-center text-xs bg-slate-800 text-white p-2 rounded-md w-full border border-pink-600/50 hover:bg-slate-700 transition">
        <Switch
          width={30} height={14} className="mr-2"
          onColor="#e60076" offColor="#101828" checkedIcon={false} uncheckedIcon={false} handleDiameter={12}
          checked={filters.includes('EXCLUDE_MODE')}
          onChange={(checked) => setFilter('EXCLUDE_MODE', checked)}
        />
        Exclude selected tags instead of including
      </label>

      <details className="w-full border border-slate-500/30 rounded-md p-2 bg-slate-100/5 cursor-pointer">
        <summary className="font-semibold select-none text-sm">Risk Level</summary>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(SEX_LEVELS).map(([key, value]) => (
            <label key={key} className="cursor-pointer flex items-center text-xs">
              <Switch
                width={30} height={14} className="mr-2"
                onColor="#e60076" offColor="#101828" checkedIcon={false} uncheckedIcon={false} handleDiameter={12}
                checked={filters.includes(key)}
                onChange={(checked) => setFilter(key, checked)}
              />
              {value.toUpperCase()}
            </label>
          ))}
        </div>
      </details>

      <details className="w-full border border-slate-500/30 rounded-md p-2 bg-slate-100/5 cursor-pointer">
        <summary className="font-semibold select-none text-sm">Features & Tags</summary>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(extraFilters).map(([key, value]) => (
            <label key={key} className="cursor-pointer flex items-center text-xs">
              <Switch
                width={30} height={14} className="mr-2"
                onColor="#e60076" offColor="#101828" checkedIcon={false} uncheckedIcon={false} handleDiameter={12}
                checked={filters.includes(key)}
                onChange={(checked) => setFilter(key, checked)}
              />
              {value.toUpperCase()}
            </label>
          ))}
        </div>
      </details>

      <button
        onClick={resetFilters}
        disabled={disabledResetButton}
        style={disabledResetButton ? { opacity: 0.3, pointerEvents: "none", cursor: "not-allowed" } : {}}
        className="mt-2 bg-slate-400 cursor-pointer hover:bg-slate-500 duration-300 text-white rounded-md shadow-md hover:shadow-lg leading-8 px-4 py-1 text-sm self-center"
      >
        Reset Filters
      </button>
    </div>
  );
}
