import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Grade = 10 | 11 | 12;

export type GradeState = {
    grade: Grade | null;
};

export type GradeActions = {
    setGrade: (grade: Grade) => void;
};

const useGradeStore = create<GradeState & GradeActions>()(
    persist(
        (set) => ({
            grade: null,
            setGrade: (grade) => set({ grade }),
        }),
        {
            name: "grade-selection",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useGradeStore;

