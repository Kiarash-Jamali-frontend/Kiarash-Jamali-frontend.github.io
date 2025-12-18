import { useEffect, useState } from "react"
import { type Tables } from "../../../database.types";
import supabase from "../../supabase/client";
import { Link } from "react-router";
import useGradeStore from "../../stores/grade";

export default function BooksList() {

    const { grade } = useGradeStore((state) => state);
    const [books, setBooks] = useState<Tables<'book'>[]>([]);

    const getBooks = async () => {
        const { data } = await supabase.from("book").select("*").eq("grade", grade!);
        if (data) {
            setBooks(data);
        } else {
            throw new Error("مشکل در دریافت لیست کتاب ها");
        }
    }

    useEffect(() => {
        getBooks();
    }, [])

    return (
        <section>
            {
                books.map((b) => {
                    return (
                        <Link to={`/book/${grade}/${b.route}`} viewTransition>
                            {b.name}
                        </Link>
                    )
                })
            }
        </section>
    )
}