import { create } from 'zustand';
import supabase from '../supabase/client';
import { persist } from 'zustand/middleware';
import type { Tables } from '../../database.types';

type RankUser = Tables<'leaderboard'> & { rank?: number };

interface RankingState {
    topUsers: RankUser[];
    isLoading: boolean;
    fetchRanking: () => Promise<void>;
}

const useRankingStore = create<RankingState>()(persist((set) => ({
    topUsers: [],
    isLoading: false,
    fetchRanking: async () => {
        set({ isLoading: true });

        // دریافت کاربران به ترتیب XP
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('xp', { ascending: false });

        if (!error && data) {
            // اضافه کردن شماره رتبه به هر آبجکت
            const rankedData = data.map((d, index) => ({
                ...d,
                rank: index + 1
            }));
            set({ topUsers: rankedData, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    }
}), { name: "ranking" }));

export default useRankingStore;