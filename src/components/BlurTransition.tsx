import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export default function BlurTransition({ children, ...rest }: { children: ReactNode } & HTMLMotionProps<"div">) {
    return (
        <AnimatePresence>
            <motion.div {...rest} initial="hide" animate="show" exit="hide" variants={{
                show: { opacity: 1, y: 0, filter: "blur(0rem)" },
                hide: { opacity: 0, y: 24, filter: "blur(1rem)" }
            }}>
                {children}
            </motion.div>
        </AnimatePresence>
    )
}