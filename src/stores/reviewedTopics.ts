import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import supabase from '../supabase/client';
import type { Tables } from '../../database.types';


interface ReviewedTopicsState {
    reviewedTopics: Tables<'reviewed_topics'>[]; // کل ردیف‌های جدول
    reviewedIds: number[]; // فقط آیدی تاپیک‌ها برای چک کردن سریع
    isLoading: boolean;
}

interface ReviewedTopicsActions {
    fetchReviewedTopics: () => Promise<unknown>;
    toggleReview: (topicId: number) => Promise<unknown>;
    isReviewed: (topicId: number) => boolean;
}

const useReviewedTopicsStore = create<ReviewedTopicsState & ReviewedTopicsActions>()(
    persist(
        (set, get) => ({
            reviewedTopics: [],
            reviewedIds: [],
            isLoading: false,

            // ۱. تابع گرفتن تمام دیتا از Supabase
            fetchReviewedTopics: async () => {
                set({ isLoading: true });
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return set({ isLoading: false });

                const { data, error } = await supabase
                    .from('reviewed_topics')
                    .select('*')
                    .eq('userId', user.id);

                if (!error && data) {
                    set({
                        reviewedTopics: data,
                        reviewedIds: data.map(item => item.topicId ),
                        isLoading: false
                    });
                } else {
                    set({ isLoading: false });
                }
            },

            // ۲. تابع Insert یا Delete (Toggle) در Supabase
            toggleReview: async (topicId: number) => {
                const { reviewedIds, reviewedTopics } = get();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const isAlreadyReviewed = reviewedIds.includes(topicId);

                if (isAlreadyReviewed) {
                    // حذف از دیتابیس
                    const { error } = await supabase
                        .from('reviewed_topics')
                        .delete()
                        .eq('userId', user.id)
                        .eq('topicId', topicId);

                    if (!error) {
                        set({
                            reviewedIds: reviewedIds.filter(id => id !== topicId),
                            reviewedTopics: reviewedTopics.filter(t => t.topicId !== topicId)
                        });
                    }
                } else {
                    // درج در دیتابیس
                    const { data, error } = await supabase
                        .from('reviewed_topics')
                        .insert({ userId: user.id, topicId: topicId })
                        .select()
                        .single();

                    if (!error && data) {
                        set({
                            reviewedIds: [...reviewedIds, topicId],
                            reviewedTopics: [...reviewedTopics, data]
                        });
                    }
                }
            },

            // چک کردن سریع وضعیت در کلاینت
            isReviewed: (topicId) => get().reviewedIds.includes(topicId),
        }),
        {
            name: 'reviewed-topics-storage',
            storage: createJSONStorage(() => localStorage),
            // فقط آیدی‌ها را در لوکال استوریج نگه می‌داریم تا دیتای حجیم ذخیره نشود
            partialize: (state) => ({ reviewedIds: state.reviewedIds }),
        }
    )
);

export default useReviewedTopicsStore;