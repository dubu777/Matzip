import { create } from "zustand";

interface useLegendState {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const useLegendStore = create<useLegendState>(set => ({
  isVisible: false,
  setIsVisible: (isVisible: boolean) => {
    set({isVisible})
  }
}))


export default useLegendStore;