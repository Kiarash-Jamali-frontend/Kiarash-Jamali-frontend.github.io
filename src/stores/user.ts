import { create } from 'zustand';
import supabase from '../supabase/client';
import { type User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';
import type { Tables } from '../../database.types';

// استخراج تایپ ردیف‌های جدول اشتراک کاربر

export interface UserState {
    user: User | null;
    coins: number;
    subscriptions: Tables<'subscription'>[]; // اضافه شدن آرایه اشتراک‌ها
    isLoading: boolean;
}

export interface UserActions {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    fetchProfile: () => Promise<void>;
    updateCoins: (amount: number) => Promise<{ success: boolean; error?: string }>;
}

const useUserStore = create<UserState & UserActions>()(persist(
    (set, get) => ({
        user: null,
        coins: 0,
        subscriptions: [], // مقدار اولیه
        isLoading: true,

        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),

        fetchProfile: async () => {
            set({ isLoading: true });
            // const { data: { user } } = await supabase.auth.getUser();
            const user = get().user;

            if (user) {
                // دریافت همزمان اطلاعات اشتراک‌ها از دیتابیس
                const { data: subData, error: subError } = await supabase
                    .from('user_subscription')
                    .select('*')
                    .eq('userId', user.id);

                if (!subError && subData) {
                    const { data: subscriptions } = await supabase.from('subscription').select('*')
                        .in('id', subData.map((d) => d.subscriptionId));

                    set({
                        user,
                        coins: user.user_metadata.coins || 0,
                        subscriptions: subscriptions || [],
                        isLoading: false
                    });
                }
            } else {
                set({ user: null, coins: 0, subscriptions: [], isLoading: false });
            }
        },

        updateCoins: async (amount: number) => {
            const currentUser = get().user;
            if (!currentUser) return { success: false, error: "کاربر وارد نشده است" };

            const newBalance = get().coins + amount;
            if (newBalance < 0) return { success: false, error: "سکه کافی ندارید" };

            const { error } = await supabase.auth.updateUser({
                data: { coins: newBalance }
            });

            if (error) return { success: false, error: error.message };
            set({ coins: newBalance });

            return { success: true };
        }
    }),
    { name: "user-session" }
));

export default useUserStore;