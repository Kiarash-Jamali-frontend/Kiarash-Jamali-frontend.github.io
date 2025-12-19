import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import supabase from "../supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faLock, faLayerGroup, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useUserStore from "../stores/user";
import type { Tables } from "../../database.types";
import LoadingMessage from "../components/LoadingMessage";
import useGradeStore from "../stores/grade";
import useReviewedTopicsStore from "../stores/reviewedTopics";
import { AnimatePresence } from "framer-motion";
import BlurTransition from "../components/BlurTransition";

// تعریف تایپ‌ها بر اساس فایل database.types شما
type Book = Tables<'book'>;
type Lesson = Tables<'lesson'>;
type Topic = Tables<'topic'>;

export default function LessonsAndTopics() {
    const { route } = useParams();
    const navigate = useNavigate();
    const { subscriptions } = useUserStore();
    const { grade } = useGradeStore();

    const [book, setBook] = useState<Book | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]); // آرایه اول: درس‌ها
    const [topics, setTopics] = useState<(Omit<Topic, 'content'>)[]>([]);   // آرایه دوم: تمام تاپیک‌ها
    const [isLoading, setIsLoading] = useState(true);
    const { isReviewed } = useReviewedTopicsStore();

    useEffect(() => {
        async function fetchData() {
            if (!route) return;
            setIsLoading(true);

            // ۱. پیدا کردن کتاب بر اساس route
            const { data: bookData } = await supabase
                .from('book')
                .select('*')
                .eq('route', route)
                .single();

            if (bookData) {
                setBook(bookData);

                // ۲. گرفتن تمام درس‌های مربوط به این کتاب
                const { data: lessonsData } = await supabase
                    .from('lesson')
                    .select('*')
                    .eq('bookId', bookData.id)
                    .order('sort', { ascending: true });

                // ۳. گرفتن تمام تاپیک‌های مربوط به این کتاب (از طریق درس‌ها)
                // نکته: در Supabase می‌توانید از فیلتر In استفاده کنید یا اگر آیدی درس‌ها را دارید:
                const { data: topicsData } = await supabase
                    .from('topic')
                    .select('id,lessonId,name,sort')
                    .in('lessonId', (lessonsData || []).map(l => l.id))
                    .order('sort', { ascending: true });

                setLessons(lessonsData || []);
                setTopics(topicsData || []);
            }
            setIsLoading(false);
        }

        fetchData();
    }, [route]);

    // چک کردن دسترسی خرید (مشابه قبل)
    const hasAccess = subscriptions.some(s =>
        s.bookId === book?.id || s.isFullSubscription
    );

    if (isLoading) return <LoadingMessage />;

    return (
        <div className="flex flex-col mt-6">
            {/* هدر */}
            <div className="flex items-center gap-x-3">
                <button onClick={() => navigate(-1)} className="size-8 rounded-full bg-secondary border grid place-items-center">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <h1 className="text-xl font-black text-natural">{book?.name}</h1>
            </div>

            <AnimatePresence>
                {
                    lessons.length && !isLoading ? (
                        <BlurTransition>
                            {/* رندر کردن درس‌ها */}
                            <div className="space-y-6 mt-4 flex flex-col">
                                {lessons.map((lesson) => (
                                    <div key={lesson.id} className="space-y-3" style={{
                                        order: lesson.sort
                                    }}>
                                        {/* سکشن درس */}
                                        <div className="flex items-center gap-x-2 px-2">
                                            <div className="size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
                                            <h3 className="font-bold text-sm text-natural/80">
                                                درس {lesson.sort}: {lesson.name}
                                            </h3>
                                        </div>

                                        {/* فیلتر کردن و رندر تاپیک‌های مربوط به این درس */}
                                        <div className="grid gap-2">
                                            {topics
                                                .filter(topic => topic.lessonId === lesson.id) // منطق اصلی تفکیک
                                                .map((topic) => (
                                                    <Link to={`/book/${grade}/${book!.route}/${topic.id}`}
                                                        style={{
                                                            order: topic.sort
                                                        }}
                                                        key={topic.id}
                                                        className={`${!hasAccess && !lesson.isFree ? "pointer-events-none" : ""} flex items-center justify-between p-4 rounded-2xl border transition-all
                                            ${hasAccess
                                                                ? "bg-secondary border-zinc-200 dark:border-white/5 active:scale-95"
                                                                : "bg-zinc-100 dark:bg-white/5 border-transparent opacity-60 grayscale cursor-not-allowed"}`}
                                                    >
                                                        <div className="flex items-center gap-x-3 text-natural">
                                                            <div className="size-7 rounded-lg bg-base border grid place-items-center text-xs font-black">
                                                                {topic.sort}
                                                            </div>
                                                            <span className="text-sm font-bold">{topic.name}</span>
                                                        </div>

                                                        {hasAccess || lesson.isFree ? (
                                                            <>
                                                                {!isReviewed(topic.id) ? (
                                                                    <FontAwesomeIcon icon={faLayerGroup} className="text-primary size-4" />
                                                                ) : (
                                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 size-4" />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <FontAwesomeIcon icon={faLock} className="text-natural/20 size-4" />
                                                        )}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* بنر خرید */}
                            {!hasAccess && (
                                <div className="mt-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                                    <p className="text-xs text-primary mb-3">برای مشاهده سرفصل‌ها و شرکت در آزمون، اشتراک تهیه کنید</p>
                                    <button onClick={() => navigate('/shop')} className="text-xs font-medium text-primary underline">برو به فروشگاه</button>
                                </div>
                            )}
                        </BlurTransition>
                    ) :
                        (
                            <div className="text-center mt-5 text-sm text-red-400">
                                محتوایی برای این کتاب پیدا نشد!
                            </div>
                        )
                }
            </AnimatePresence>
        </div>
    );
}