import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserState = {
    user: User | null;
    isLoading: boolean;
    // subscription: Subscription | null;
};

export type UserActions = {
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
};

const useUserStore = create<UserState & UserActions>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            setUser: (user) => set({ user, isLoading: false }),
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: "user-session",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);

export default useUserStore;

