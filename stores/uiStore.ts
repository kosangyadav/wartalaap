import { create } from "zustand";

interface UIStore {
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
}

const getIsMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
};

export const useUIStore = create<UIStore>((set) => ({
  isMobile: getIsMobile(),
  setIsMobile: (mobile: boolean) => set({ isMobile: mobile }),
}));
