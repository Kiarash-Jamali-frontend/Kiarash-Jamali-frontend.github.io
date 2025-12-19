import { create } from 'zustand';
import supabase from '../supabase/client';
import type { Tables } from '../../database.types';
import type { Grade } from './grade';
import { persist } from 'zustand/middleware';

interface ShopState {
    packages: Tables<'test_package'>[];
    isLoading: boolean;
    fetchPackages: (grade: Grade) => Promise<void>;
}

const useShopStore = create<ShopState>()(persist(
    (set) => ({
        packages: [],
        isLoading: false,
        fetchPackages: async (grade: Grade) => {
            set({ isLoading: true });
            const { data, error } = await supabase.from('test_package').select('*').eq("grade", grade);
            if (!error && data) {
                set({ packages: data, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        }
    })
    , { name: "shop" }
));

export default useShopStore;