import useThemeStore from "@/store/useThemeStore";
import { ThemeMode } from "@/types";
import { getEncryptStorage, setEncryptStorage } from "@/utils";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

function useThemeStorage() {
  // useColorScheme은 운영 체제의 테마 모드를 가져온다.
  // 라이트 모드, 다크모드를 감지하고 반환한다.
  const systemTheme = useColorScheme();
  const {theme, isSystem, setTheme, setSystemTheme} = useThemeStore();

  const setMode = async(mode: ThemeMode) => {
    await setEncryptStorage('themeMode', mode);
    setTheme(mode);
  };
  
  const setSystem = async(flag: boolean) => {
    await setEncryptStorage('themeSystem', flag);
    setSystemTheme(flag);
  };

  useEffect(() => {
    (async () => {
      const mode = (await getEncryptStorage('themeMode')) ?? 'light';
      const systemMode = (await getEncryptStorage('themeSystem')) ?? 'false';
      const newMode = systemMode ? systemTheme : mode;
      setTheme(newMode);
      setSystemTheme(systemMode);
    })();
  }, [theme, isSystem, setMode, setSystem])

  return {theme, isSystem, setMode, setSystem};
}

export default useThemeStorage;