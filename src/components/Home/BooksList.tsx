import { type Tables } from "../../../database.types";
import { Link } from "react-router";
import useGradeStore from "../../stores/grade";
import { GRADE_LABELS } from "../../constants/gridLabels";

export default function BooksList({ books }: { books: Tables<'book'>[] }) {

    const { grade } = useGradeStore((state) => state);
    // const [books, setBooks] = useState<Tables<'book'>[]>([]);

    return (
        <section className="flex flex-col grow mt-5">
            <div className="mb-2 font-semibold">
                کتاب های {GRADE_LABELS[grade]}
            </div>
            <div className="space-y-4 overflow-auto scrollbar-hidden">
                {
                    books.map((b) => {
                        return (
                            <Link key={b.id} to={`/book/${grade}/${b.route}`} viewTransition
                                className="rounded-xl border flex bg-secondary">
                                <div className="p-4 w-[60%]">
                                    <div className="font-medium">
                                        {b.name}
                                    </div>
                                    <div className="mt-1 text-sm text-natural/60">
                                        {b.description}
                                    </div>
                                </div>
                                <div className="grow w-[40%] flex justify-end">
                                    <img src={b.image} className="w-full h-full max-h-32 object-contain" />
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </section>
    )
}