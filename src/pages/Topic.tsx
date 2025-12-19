import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faX,
} from "@fortawesome/free-solid-svg-icons";
import useReviewedTopicsStore from "../stores/reviewedTopics";
import button from "../cva/button";
import BlurTransition from "../components/BlurTransition";
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

// محتوای نمونه (در پروژه واقعی این را از دیتابیس می‌گیرید)
const TOPIC_SLIDES = [
    `# 📘 فصل اول: مفاهیم پایه
در این بخش ما به بررسی **متغیرها** و نحوه عملکرد آن‌ها می‌پردازیم. دقت کنید که یادگیری این بخش برای مراحل بعد **حیاتی** است.

### 💡 نکات کلیدی
* **دقت بالا** در محاسبات
* مدیریت صحیح *زمان*
* تمرکز بر مفاهیم اصلی

---

### 📊 جدول مقایسه‌ای
در جدول زیر تفاوت دو حالت اصلی را مشاهده می‌کنید:

| مفهوم | وضعیت | امتیاز |
| :--- | :---: | :---: |
| متغیر ساده | ✅ فعال | ۱۰ |
| متغیر ترکیبی | ⚠️ در انتظار | ۵ |

> **فراموش نکنید:** "تمرین مداوم، تنها راه تسلط بر مباحث پیچیده ریاضی است."

---`,
    "# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.# تعاریف اصلی\nمتغیرها و ثابت‌ها بخش جدایی ناپذیر از این مبحث هستند.",
    "# جمع‌بندی\nحالا شما آماده‌اید تا در آزمون این بخش شرکت کنید."
];

export default function TopicContent() {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const { toggleReview, isReviewed } = useReviewedTopicsStore();

    // آیا این تاپیک قبلاً در دیتابیس به عنوان بررسی شده ثبت شده است؟
    const isAlreadyReviewedInDb = useMemo(() =>
        topicId ? isReviewed(parseInt(topicId)) : false,
        [topicId, isReviewed]);

    const [currentSlide, setCurrentSlide] = useState(0);

    // برای ردیابی اسلایدهایی که کاربر در همین لحظه دیده است (تا در برگشت عقب تایمر نخورد)


    const handleNext = () => {
        if (currentSlide < TOPIC_SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // اگر قبلاً در دیتابیس نبوده، الان ثبتش کن
            if (topicId && !isAlreadyReviewedInDb) {
                toggleReview(parseInt(topicId));
            }
            navigate(-1);
        }
    };

    const progressPercentage = ((currentSlide + 1) / TOPIC_SLIDES.length) * 100;

    return (
        <BlurTransition className="flex flex-col grow h-[calc(100vh-12rem)] mt-4">
            {/* ProgressBar */}
            <div className="w-full h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* محتوای Markdown */}
            <div className="my-4 markdown leading-7 text-sm flex-1 bg-secondary border border-zinc-200 dark:border-white/5 rounded-xl p-4 overflow-y-auto prose dark:prose-invert max-w-none shadow-sm text-right" dir="rtl">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeKatex]}>{TOPIC_SLIDES[currentSlide]}</ReactMarkdown>
            </div>

            {/* دکمه‌های ناوبری */}
            <div className="grid grid-cols-2 gap-x-4 mt-auto pb-4">
                <button
                    onClick={() => currentSlide > 0 ? setCurrentSlide(currentSlide - 1) : navigate(-1)}
                    className={button({ intent: "primaryOutline" })}
                >
                    <FontAwesomeIcon icon={currentSlide > 0 ? faChevronRight : faX} className="ml-2" />
                    {currentSlide > 0 ? "قبلی" : "لغو"}
                </button>

                <button
                    onClick={handleNext}
                    className={button({
                        intent: "primary",
                        size: "medium",
                    })}
                >
                    {currentSlide === TOPIC_SLIDES.length - 1 ? "پایان مطالعه" : "بعدی"}
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                </button>
            </div>
        </BlurTransition>
    );
}