import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import button from "../cva/button";
import useGradeStore, { type Grade, type GradeActions, type GradeState } from "../stores/grade";
import { useNavigate } from "react-router";

const GRADE_LABELS: Record<Grade, string> = {
    10: "پایه دهم",
    11: "پایه یازدهم",
    12: "پایه دوازدهم",
};

export default function Grade() {
    const navigate = useNavigate();
    const { grade, setGrade } = useGradeStore((state: GradeState & GradeActions) => state);

    const isSelected = (g: Grade) => grade === g;

    const handleContinue = () => {
        navigate("/auth", { viewTransition: true });
    };

    return (
        <div className="p-5 flex flex-col grow gap-y-4">
            <div className="flex items-center mb-2 gap-x-2.5">
                <button
                    type="button"
                    onClick={() => navigate("/theme", { viewTransition: true })}
                    className="size-8 rounded-full bg-secondary border grid place-items-center"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <h2 className="text-2xl font-bold">انتخاب پایه تحصیلی</h2>
            </div>
            <p className="text-natural/60 mb-4 text-sm">
                پایه‌‌ای که الان توش هستی رو انتخاب کن تا همه چیز بر اساس همون برات تنظیم بشه.
            </p>

            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={() => setGrade(10)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                    ${isSelected(10)
                            ? "border-blue-600 border-2 bg-blue-600/15"
                            : "border-zinc-200 bg-blue-600/10 text-natural"
                        }`}
                >
                    <div className="flex items-center justify-between gap-x-3">
                        <div className="flex-1 text-right">
                            <div className={`font-semibold ${isSelected(10) ? "text-blue-600" : ""}`}>
                                {GRADE_LABELS[10]}
                            </div>
                            <div className="text-xs mt-1 text-natural/70">
                                شروع مسیر متوسطه دوم؛ از همین‌جا قوی شروع کنیم.
                            </div>
                        </div>
                        <div
                            className={`shrink-0 size-12 rounded-full grid place-items-center text-xl font-bold
                            ${isSelected(10) ? "bg-blue-600 text-white" : "bg-blue-600/40 text-white"}`}
                        >
                            ۱۰
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setGrade(11)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                    ${isSelected(11)
                            ? "border-emerald-600 border-2 bg-emerald-600/15"
                            : "border-zinc-200 bg-emerald-600/10 text-natural"
                        }`}
                >
                    <div className="flex items-center justify-between gap-x-3">
                        <div className="flex-1 text-right">
                            <div className={`font-semibold ${isSelected(11) ? "text-emerald-600" : ""}`}>
                                {GRADE_LABELS[11]}
                            </div>
                            <div className="text-xs mt-1 text-natural/70">
                                سال مهم مرور و جمع‌بندی برای سال دوازدهم.
                            </div>
                        </div>
                        <div
                            className={`shrink-0 size-12 rounded-full grid place-items-center text-xl font-bold
                            ${isSelected(11) ? "bg-emerald-600 text-white" : "bg-emerald-600/40 text-white"}`}
                        >
                            ۱۱
                        </div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setGrade(12)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                    ${isSelected(12)
                            ? "border-amber-600 border-2 bg-amber-600/15"
                            : "border-zinc-200 bg-amber-600/10 text-natural"
                        }`}
                >
                    <div className="flex items-center justify-between gap-x-3">
                        <div className="flex-1 text-right">
                            <div className={`font-semibold ${isSelected(12) ? "text-amber-600" : ""}`}>
                                {GRADE_LABELS[12]}
                            </div>
                            <div className="text-xs mt-1 text-natural/70">
                                سال سرنوشت‌ساز؛ همه‌چیز برای نمره عالی آماده می‌شه.
                            </div>
                        </div>
                        <div
                            className={`shrink-0 size-12 rounded-full grid place-items-center text-xl font-bold
                            ${isSelected(12) ? "bg-amber-600 text-white" : "bg-amber-600/40 text-white"}`}
                        >
                            ۱۲
                        </div>
                    </div>
                </button>
            </div>

            <button
                type="button"
                className={button({ className: "w-full mt-auto" })}
                onClick={handleContinue}
            >
                ورود به حساب کاربری
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        </div>
    );
}


