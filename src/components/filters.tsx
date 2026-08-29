import Switch from "react-switch";

import { useActions } from "@/hooks";
import { SEX_LEVELS } from "@/constants";

export function Filters() {
  const { filters, setFilter } = useActions();

  const extraFilters = {
    FAVORITES: "Favorites Only",
    ANAL: "Anal",
    VAGINAL: "Vaginal",
    ORAL: "Oral",
    ALREADY_DONE: "Already Done"
  };

  return (
    <div className="w-full z-10 flex flex-col gap-3 text-slate-700 rounded-md bg-slate-100/10 backdrop-blur-sm dark:text-white p-5 shadow-md">
      <h5 className="text-md text-center font-bold mb-2">Filter positions</h5>

      <details className="w-full border border-slate-500/30 rounded-md p-2 bg-slate-100/5 cursor-pointer">
        <summary className="font-semibold select-none">Risk Level</summary>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(SEX_LEVELS).map(([key, value]) => (
            <label key={key} className="cursor-pointer flex items-center text-sm">
              <Switch
                width={40} height={10} className="mr-2"
                onColor="#e60076" offColor="#101828" checkedIcon={false} uncheckedIcon={false} handleDiameter={20}
                checked={filters.includes(key)}
                onChange={(checked) => setFilter(key, checked)}
              />
              {value.toUpperCase()}
            </label>
          ))}
        </div>
      </details>

      <details className="w-full border border-slate-500/30 rounded-md p-2 bg-slate-100/5 cursor-pointer">
        <summary className="font-semibold select-none">Features & Tags</summary>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(extraFilters).map(([key, value]) => (
            <label key={key} className="cursor-pointer flex items-center text-sm">
              <Switch
                width={40} height={10} className="mr-2"
                onColor="#e60076" offColor="#101828" checkedIcon={false} uncheckedIcon={false} handleDiameter={20}
                checked={filters.includes(key)}
                onChange={(checked) => setFilter(key, checked)}
              />
              {value.toUpperCase()}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
