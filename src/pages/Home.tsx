import BooksList from "../components/Home/BooksList";
import { AnimatePresence } from "framer-motion";
import useBooksStore from "../stores/books";
import LoadingMessage from "../components/LoadingMessage";
import BlurTransition from "../components/BlurTransition";

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
                        <BlurTransition>
                            <BooksList books={books} />
                        </BlurTransition>
                    )
                }
            </AnimatePresence>
        </div>
    )
}