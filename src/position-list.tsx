import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { useAppContext } from "@/hooks";
import { PositionListCard } from "@/components/position-list-card";
import { PositionListHeader } from "@/components/position-list-header";
import { PositionListGridCard } from "@/components/position-list-grid-card";
import { useCustomTags } from "@/utils";
import { data as rawData, type DataItem } from "../data";

export function PositionList() {
  const { showGrid, showFavorites, favoritePositions } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAlpha, setSortAlpha] = useState(false);
  const customTags = useCustomTags(); // #14

  const data = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      ...(customTags[String(item.id)] || {})
    }));
  }, [customTags]);

  const positions = useMemo(() => {
    let result = data;
    if (showFavorites) {
      result = result.filter((item: DataItem) => favoritePositions.includes(item.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item: DataItem) => item.title.toLowerCase().includes(q));
    }
    if (sortAlpha) {
      result = [...result].sort((a, b) => {
        const titleA = a.title.replace(/^[0-9\-\s]+/, "").trim();
        const titleB = b.title.replace(/^[0-9\-\s]+/, "").trim();
        return titleA.localeCompare(titleB);
      });
    }
    return result;
  }, [showFavorites, favoritePositions, searchQuery, sortAlpha, data]);

  return (
    <div
      style={{ width: "90%" }}
      className="flex items-center justify-center w-full flex-col gap-4 p-5 relative mx-auto max-w-2xl"
    >
      <PositionListHeader />
      
      <div className="w-full flex gap-2 items-center z-10 dark:text-white mb-2">
        <input 
          type="search"
          placeholder="Cerca per titolo..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 p-2 rounded-md bg-slate-100/10 border border-slate-500/50 outline-none"
        />
        <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap text-sm border border-slate-500/50 p-2 rounded-md bg-slate-100/10">
          <input type="checkbox" checked={sortAlpha} onChange={e => setSortAlpha(e.target.checked)} />
          A-Z
        </label>
      </div>

      <ul
        className={clsx("w-full gap-2 pb-10", {
          "grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2": showGrid,
          "flex flex-col": !showGrid,
        })}
      >
        {positions.map((item: DataItem, index: number) =>
          showGrid ? (
            <PositionListGridCard key={item.id} position={item} />
          ) : (
            <PositionListCard key={item.id} position={item} order={index + 1} />
          )
        )}
        {/* #20: empty state */}
        {positions.length === 0 && (
          <li className="text-center text-sm opacity-70 py-10 col-span-full">
            No positions found{searchQuery ? ` for "${searchQuery}"` : ""}.{" "}
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="underline text-pink-400">
                Clear search
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
