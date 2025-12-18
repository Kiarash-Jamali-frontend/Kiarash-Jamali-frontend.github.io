import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type IntroState = {
    checked: boolean;
}

export type IntroAction = {
    checkIntro: () => unknown
}

const useIntroStore = create<IntroState & IntroAction>()(
    persist(
        (set) => ({
            checked: false,
            checkIntro: () => set({ checked: true })
        }),
        {
            name: 'intro-checked',
            storage: createJSONStorage(() => localStorage)
        },
    ),
)

export default useIntroStore;