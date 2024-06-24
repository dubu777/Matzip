import { storageKeys } from "@/constants";
import useMarkerFilterStore from "@/store/useMarkerFilterStore";
import { Marker } from "@/types";
import { getEncryptStorage, setEncryptStorage } from "@/utils";
import { useEffect, useState } from "react";

const initialFilters = {
  RED: true,
  YELLOW: true,
  GREEN: true,
  BLUE: true,
  PURPLE: true,
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
}

function useMarkerFilter() {
  const {filterItems, setFilterItems} = useMarkerFilterStore();
  
  const set = async(items: Record<string, boolean>) => {
    await setEncryptStorage(storageKeys.MARKER_FILTER, items);
    setFilterItems(items)
  }

  const transformFilteredMarker = (markers: Marker[]) => {
    return markers.filter(marker => (
      filterItems[marker.color] === true &&
      filterItems[String(marker.score)] === true
    ))
  }

  useEffect(() => {
    (async () => {
      const storedData = (await getEncryptStorage(storageKeys.MARKER_FILTER)) ?? initialFilters;
      setFilterItems(storedData)
    })()
  }, [])

  return {set, items: filterItems, transformFilteredMarker};
}

export default useMarkerFilter;