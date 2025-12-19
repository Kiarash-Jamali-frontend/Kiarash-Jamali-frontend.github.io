import BooksList from "../components/Home/BooksList";
import { AnimatePresence, motion } from "framer-motion";
import useBooksStore from "../stores/books";
import LoadingMessage from "../components/LoadingMessage";

export default function Home() {
    const { books, isLoading } = useBooksStore();
    return (
        <div className="flex flex-col grow">
            {
                isLoading && (
                    <LoadingMessage />
                )
            }
            <AnimatePresence>
                {
                    !isLoading && (
                        <motion.div initial="hide" animate="show" exit="hide" variants={{
                            show: { opacity: 1, y: 0, filter: "blur(0rem)" },
                            hide: { opacity: 0, y: 24, filter: "blur(1rem)" }
                        }}>
                            <BooksList books={books} />
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}