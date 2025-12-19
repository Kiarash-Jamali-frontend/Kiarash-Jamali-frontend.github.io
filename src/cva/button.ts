import { cva } from "class-variance-authority";

const button = cva("flex items-center justify-center text-center gap-x-1 cursor-pointer font-semibold border rounded-xl transition-all duration-300", {
    variants: {
        intent: {
            primary: "text-white bg-primary hover:bg-primary-600",
            primaryOutline: "text-primary bg-primary/5 border-primary hover:bg-primary-600/10",
            dangerOutline: "text-red-500 bg-red-500/5 border-red-500 hover:bg-red-600/10"
        },
        size: {
            medium: "p-3"
        },
        disabled: {
            false: null,
            true: "opacity-50 pointer-events-none cursor-not-allowed",
        },
    },
    compoundVariants: [
    ],
    defaultVariants: {
        intent: "primary",
        size: "medium"
    },
});

export default button;