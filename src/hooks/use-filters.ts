import { parse } from "qs";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import { QUERY_PARAMS_KEYS } from "@/constants";
import { normalizeLevel, isLevelFilter } from "@/constants/filters";
import { getRandomNumber, useCustomTags } from "@/utils";
import { useAppContext } from "./use-app-context";

import { data as rawData } from "../../data";
import type { DataItem } from "../../data";

// #9: single source of truth for filtering
function applyFilters(data: DataItem[], filters: string[], favorites: number[]): DataItem[] {
  const exclude = filters.includes('EXCLUDE_MODE');
  const levels = filters.filter(isLevelFilter);

  const matches = (item: DataItem) => {
    if (levels.length > 0 && !levels.includes(normalizeLevel(item.level) ?? "")) return false;
    if (filters.includes('FAVORITES') && !favorites.includes(item.id)) return false;
    if (filters.includes('ANAL') && !item.anal) return false;
    if (filters.includes('VAGINAL') && !item.vaginal) return false;
    if (filters.includes('ORAL') && !item.oral) return false;
    if (filters.includes('ALREADY_DONE') && !item.already_done) return false;
    return true;
  };

  return exclude ? data.filter(item => !matches(item)) : data.filter(matches);
}

export function useActions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoritePositions } = useAppContext();
  const customTags = useCustomTags(); // #14: useSyncExternalStore

  // #8: validate position ID
  const rawId = Number(searchParams.get(QUERY_PARAMS_KEYS.POSITION_ID));
  const positionId = Number.isFinite(rawId) ? rawId : 0;

  // #11: memoize filters from raw string
  const filtersRaw = searchParams.get(QUERY_PARAMS_KEYS.FILTERS) ?? "";
  const filters = useMemo(
    () => Object.keys(parse(filtersRaw, { delimiter: "," })),
    [filtersRaw]
  );

  const data = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      ...(customTags[String(item.id)] || {})
    }));
  }, [customTags]);

  // #9: single applyFilters call
  const filteredData = useMemo(
    () => applyFilters(data, filters, favoritePositions),
    [filters, data, favoritePositions]
  );

  const setPositionId = (id: number) => {
    searchParams.set(QUERY_PARAMS_KEYS.POSITION_ID, id.toString());
    setSearchParams(searchParams);
  };

  const setFilter = useCallback(
    (level: string, isActive: boolean) => {
      const newFilters = isActive
        ? [...filters, level]
        : filters.filter((filterItem) => filterItem !== level);

      if (newFilters.length > 0) {
        searchParams.set(QUERY_PARAMS_KEYS.FILTERS, newFilters.join(","));
      } else {
        searchParams.delete(QUERY_PARAMS_KEYS.FILTERS);
      }

      // #9: reuse applyFilters
      const result = applyFilters(data, newFilters, favoritePositions);
      if (result.length > 0) {
        const nextIndex = getRandomNumber(0, result.length - 1);
        searchParams.set(QUERY_PARAMS_KEYS.POSITION_ID, result[nextIndex].id.toString());
      }

      setSearchParams(searchParams);
    },
    [filters, data, favoritePositions]
  );

  // #19: reset only filters, keep position
  const resetFilters = () => {
    searchParams.delete(QUERY_PARAMS_KEYS.FILTERS);
    setSearchParams(searchParams);
  };

  // #8: null instead of silent fallback
  const activePosition = useMemo(() => {
    return filteredData.find((item) => item.id === positionId) ?? null;
  }, [positionId, filteredData]);

  return {
    setFilter,
    resetFilters,
    setPositionId,
    filters,
    positionId,
    filteredData,
    activePosition,
  };
}
