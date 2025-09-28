import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (userDetails: User) =>
        set({ user: userDetails, isLoggedIn: true }),
      removeUser: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: "user" },
  ),
);
