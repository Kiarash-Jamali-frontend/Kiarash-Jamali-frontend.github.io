import { cva } from "class-variance-authority";

const input = cva(
    "w-full rounded-xl border-2 bg-secondary text-natural placeholder:text-natural/40 outline-none transition-colors duration-200",
    {
        variants: {
            size: {
                md: "px-3 py-2 text-sm",
                lg: "px-4 py-3 text-base",
            },
            state: {
                default: "border-zinc-200 focus:border-primary",
                error: "border-red-500 focus:border-red-500",
                disabled: "opacity-60 cursor-not-allowed",
            },
        },
        defaultVariants: {
            size: "lg",
            state: "default",
        },
    }
);

export default input;

