import BooksList from "../components/Home/BooksList";
import Header from "../components/Header";
import type { Grade } from "../stores/grade";
import type { Tables } from "../../database.types";
import supabase from "../supabase/client";
import { Suspense } from "react";
import useGradeStore from "../stores/grade";
import { AnimatePresence, motion } from "framer-motion";

const getBooks = async (grade: Grade): Promise<Tables<'book'>[]> => {
    const { data } = await supabase.from("book").select("*").eq("grade", grade!);
    return data || [];
}

export default function Home() {
    const { grade } = useGradeStore((state) => state);
    const booksPromise = getBooks(grade);

    return (
        <div className="flex flex-col grow">
            <Header />
            <Suspense fallback={
                <div className="mt-5 text-sm text-center">در حال بارگذاری...</div>
            }>
                <AnimatePresence>
                    <motion.div initial="hide" animate="show" exit="hide" variants={{
                        show: { opacity: 1, y: 0, filter: "blur(0rem)" },
                        hide: { opacity: 0, y: 24, filter: "blur(1rem)" }
                    }}>
                        <BooksList booksPromise={booksPromise} />
                    </motion.div>
                </AnimatePresence>
            </Suspense>
        </div>
    )
}