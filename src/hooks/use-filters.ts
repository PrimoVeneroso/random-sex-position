import { parse } from "qs";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { QUERY_PARAMS_KEYS } from "@/constants";
import { getRandomNumber, getCustomTags } from "@/utils";
import { useAppContext } from "./use-app-context";

import { data as rawData, type DataItem } from "../../data";

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
    
    const levelFilters = filters.filter(f => ['SAFE', 'DANGEROUS', 'BE_CAREFUL'].includes(f));
    if (levelFilters.length > 0) {
      result = result.filter((item) => levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
    }
    
    if (filters.includes('FAVORITES')) result = result.filter(item => favoritePositions.includes(item.id));
    if (filters.includes('ANAL')) result = result.filter(item => item.anal);
    if (filters.includes('VAGINAL')) result = result.filter(item => item.vaginal);
    if (filters.includes('ORAL')) result = result.filter(item => item.oral);
    if (filters.includes('ALREADY_DONE')) result = result.filter(item => item.already_done);
    
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

      let result = data;
      const levelFilters = newFilters.filter(f => ['SAFE', 'DANGEROUS', 'BE_CAREFUL'].includes(f));
      if (levelFilters.length > 0) result = result.filter((item) => levelFilters.includes(item.level.toUpperCase().replace(" ", "_")));
      if (newFilters.includes('FAVORITES')) result = result.filter(item => favoritePositions.includes(item.id));
      if (newFilters.includes('ANAL')) result = result.filter(item => item.anal);
      if (newFilters.includes('VAGINAL')) result = result.filter(item => item.vaginal);
      if (newFilters.includes('ORAL')) result = result.filter(item => item.oral);
      if (newFilters.includes('ALREADY_DONE')) result = result.filter(item => item.already_done);

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
