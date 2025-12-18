import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeState = {
    mode: ThemeMode;
};

export type ThemeActions = {
    setMode: (mode: ThemeMode) => void;
};

const useThemeStore = create<ThemeState & ThemeActions>()(
    persist(
        (set) => ({
            mode: 'system',
            setMode: (mode) => set({ mode }),
        }),
        {
            name: 'theme-preference',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useThemeStore;

