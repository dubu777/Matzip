import { storageKeys } from "@/constants";
import useLegendStore from "@/store/useLegendStore";
import { getEncryptStorage, setEncryptStorage } from "@/utils";
import { useEffect } from "react";

function useLegendStorage() {
  const {isVisible, setIsVisible} = useLegendStore();

  const set = async(flag: boolean) => {
    await setEncryptStorage(storageKeys.SHOW_LEGEND, flag);
    setIsVisible(flag);
  }

  useEffect(() => {
    (async () => {
      const storeData = (await getEncryptStorage(storageKeys.SHOW_LEGEND)) ?? false;
      setIsVisible(storeData);
    })()
  }, [setIsVisible])

  return {set, isVisible}
}

export default useLegendStorage;