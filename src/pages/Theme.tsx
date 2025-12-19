import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import button from "../cva/button";
import useThemeDetector from "../hooks/useThemeDetector";
import useThemeStore, { type ThemeActions, type ThemeState, type ThemeMode } from "../stores/theme";
import { useNavigate } from "react-router";
import { faChevronLeft, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import BlurTransition from "../components/BlurTransition";

const getOppositeMode = (mode: ThemeMode): ThemeMode => {
    if (mode === "light") return "dark";
    if (mode === "dark") return "light";
    return mode;
};

export default function Theme() {
    const isSystemDark = useThemeDetector();
    const navigate = useNavigate();
    const { mode, setMode } = useThemeStore((state: ThemeState & ThemeActions) => state);

    const currentSystemMode: ThemeMode = isSystemDark ? "dark" : "light";
    const firstOptionMode = currentSystemMode;
    const secondOptionMode = getOppositeMode(currentSystemMode);
    const isDarkTheme = currentSystemMode === "dark";

    const isSelected = (target: ThemeMode) => mode === target;

    const handleContinue = () => {
        navigate("/grade", { viewTransition: true });
    };

    return (
        <BlurTransition className="flex flex-col grow gap-y-4">
            <h2 className="text-2xl font-bold mb-2">انتخاب تم</h2>
            <p className="text-natural/60 mb-4 text-sm">
                لطفاً تم مورد نظرت رو انتخاب کن. هر زمان خواستی می‌تونی از تنظیمات دوباره عوضش کنی.
            </p>

            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={() => setMode(firstOptionMode)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-secondary
                    ${isSelected(firstOptionMode) ? "text-primary border-primary border-2" : "text-natural border-zinc-200"}`}
                >
                    <div className="flex items-center gap-x-2">
                        <FontAwesomeIcon icon={isDarkTheme ? faMoon : faSun} />
                        <div className="font-semibold">
                            {isDarkTheme ? "تم تیره" : "تم روشن"}
                        </div>
                    </div>
                    <div className="text-xs mt-1 text-start">
                        مطابق تمی که الان روی دستگاهت فعاله، اما ثابت می‌مونه.
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setMode(secondOptionMode)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-secondary
                    ${isSelected(secondOptionMode) ? "text-primary border-primary border-2" : "text-natural border-zinc-200"}`}
                >
                    <div className="flex items-center gap-x-2">
                        <FontAwesomeIcon icon={!isDarkTheme ? faMoon : faSun} />
                        <div className="font-semibold">
                            {isDarkTheme ? "تم روشن" : "تم تیره"}
                        </div>
                    </div>
                    <div className="text-xs mt-1 text-start">
                        دقیقاً برعکس تم فعلی سیستم روی زیکو اعمال می‌شه.
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setMode("system")}
                    className={`w-full text-right px-4 py-3 rounded-xl border transition-all duration-200 bg-secondary
                    ${isSelected("system") ? "text-primary border-primary border-2" : "text-natural border-zinc-200"}`}
                >
                    <div className="font-semibold">تم خودکار</div>
                    <div className="text-xs mt-1">
                        همیشه طبق تنظیمات تم سیستم تغییر می‌کنه.
                    </div>
                </button>
            </div>

            <button
                type="button"
                className={button({ className: "w-full mt-auto" })}
                onClick={handleContinue}
            >
                انتخاب پایه تحصیلی
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        </BlurTransition>
    );
}


