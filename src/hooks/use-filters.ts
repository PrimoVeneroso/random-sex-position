import { parse } from "qs";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { QUERY_PARAMS_KEYS } from "@/constants";
import { getRandomNumber, getCustomTags } from "@/utils";
import { useAppContext } from "./use-app-context";

import { data as rawData } from "../../data";

export function useActions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoritePositions } = useAppContext();
  const [customTags, setCustomTags] = useState(getCustomTags());

  useEffect(() => {
    const handleStorage = () => setCustomTags(getCustomTags());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const positionId = Number(
    searchParams.get(QUERY_PARAMS_KEYS.POSITION_ID) || 0
  );

  const filters = Object.keys(
    parse(searchParams.get(QUERY_PARAMS_KEYS.FILTERS) || "", {
      delimiter: ",",
    })
  );

  const data = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      ...(customTags[item.id] || {})
    }));
  }, [customTags]);

  const filteredData = useMemo(() => {
    let result = data;
    const isExcludeMode = filters.includes('EXCLUDE_MODE');
    
    const levelFilters = filters.filter(f => ['SAFE', 'DANGEROUS', 'BE_CAREFUL'].includes(f));
    if (levelFilters.length > 0) {
      if (isExcludeMode) {
        result = result.filter((item) => !levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
      } else {
        result = result.filter((item) => levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
      }
    }
    
    const applyFilter = (key: string, matchFn: (i: any) => boolean) => {
      if (filters.includes(key)) {
        if (isExcludeMode) {
          result = result.filter(item => !matchFn(item));
        } else {
          result = result.filter(item => matchFn(item));
        }
      }
    };

    applyFilter('FAVORITES', item => favoritePositions.includes(item.id));
    applyFilter('ANAL', item => item.anal);
    applyFilter('VAGINAL', item => item.vaginal);
    applyFilter('ORAL', item => item.oral);
    applyFilter('ALREADY_DONE', item => item.already_done);
    
    return result;
  }, [filters, data, favoritePositions]);

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

      // We just need to randomly pick one if possible, so we can re-evaluate filtering here or let UI handle the click later
      // Since it's heavy to duplicate filtering logic, we can rely on UI "New Position" if nextIndex logic fails here
      // But let's copy the same exclude mode logic to maintain behavior:
      let result = data;
      const isExcludeMode = newFilters.includes('EXCLUDE_MODE');
      
      const levelFilters = newFilters.filter(f => ['SAFE', 'DANGEROUS', 'BE_CAREFUL'].includes(f));
      if (levelFilters.length > 0) {
        if (isExcludeMode) result = result.filter((item) => !levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
        else result = result.filter((item) => levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
      }
      
      const applyFilterSync = (key: string, matchFn: (i: any) => boolean) => {
        if (newFilters.includes(key)) {
          if (isExcludeMode) result = result.filter(item => !matchFn(item));
          else result = result.filter(item => matchFn(item));
        }
      };

      applyFilterSync('FAVORITES', item => favoritePositions.includes(item.id));
      applyFilterSync('ANAL', item => item.anal);
      applyFilterSync('VAGINAL', item => item.vaginal);
      applyFilterSync('ORAL', item => item.oral);
      applyFilterSync('ALREADY_DONE', item => item.already_done);

      if (result.length > 0) {
          const nextIndex = getRandomNumber(0, result.length - 1);
          searchParams.set(
            QUERY_PARAMS_KEYS.POSITION_ID,
            result[nextIndex].id.toString()
          );
      }

      setSearchParams(searchParams);
    },
    [filters, data, favoritePositions]
  );

  const resetFilters = () => {
    searchParams.delete(QUERY_PARAMS_KEYS.FILTERS);
    searchParams.delete(QUERY_PARAMS_KEYS.POSITION_ID);
    setSearchParams(searchParams);
  };

  const activePosition = useMemo(() => {
    return (
      filteredData.find((item) => item.id === positionId) ?? filteredData[0]
    );
  }, [filters, positionId, filteredData]);

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
