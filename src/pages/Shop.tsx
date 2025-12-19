import { useState } from "react";
import button from "../cva/button";
import toast from "react-hot-toast";
import type { Tables } from "../../database.types";
import useUserStore from "../stores/user";
import useShopStore from "../stores/shop";
import { AnimatePresence } from "framer-motion";
import LoadingMessage from "../components/LoadingMessage";
import BlurTransition from "../components/BlurTransition";

export default function Shop() {
    const { user, updateCoins } = useUserStore();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const { packages, isLoading } = useShopStore();
    const coins = user?.user_metadata?.coins ?? 0;

    const handleBuy = async (pkg: Tables<'test_package'>) => {
        // در اینجا منطق چک کردن سکه و کسر آن از دیتابیس قرار می‌گیرد
        setLoadingId(pkg.id);

        // شبیه‌سازی خرید
        setTimeout(() => {
            if (coins >= pkg.price) {
                updateCoins(-pkg.price);
                toast.success(`بسته ${pkg.name} با موفقیت خریداری شد`);
            } else {
                toast.error(`موجودی سکه شما کافی نیست!`);
            }
            setLoadingId(null);
        }, 1500);
    };

    return (
        <div className="flex flex-col grow">
            <div className="space-y-5 mt-8">
                {/* هدر فروشگاه و نمایش سکه */}
                <h1 className="text-2xl font-bold text-natural">فروشگاه</h1>

                {
                    isLoading && (
                        <LoadingMessage />
                    )
                }

                <AnimatePresence>
                    {
                        !isLoading && (
                            <BlurTransition>
                                {/* لیست پکیج‌ها */}
                                <div className="grid gap-4">
                                    {packages.map((pkg) => (
                                        <div key={pkg.id} className="bg-secondary p-4 rounded-2xl border border-zinc-200 dark:border-white/10 flex flex-col gap-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-natural">{pkg.name}</h3>
                                                    <p className="text-xs text-natural/60 mt-1">{pkg.description}</p>
                                                </div>
                                                <div className="bg-base px-2 py-1 rounded-lg text-[0.65rem] text-natural/80 border">
                                                    {pkg.question_count.toLocaleString("fa-IR")} سوال
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-x-1 text-primary font-bold">
                                                    <span>{pkg.price.toLocaleString("fa-IR")}</span>
                                                    <span className="text-xs">سکه</span>
                                                </div>

                                                <button
                                                    onClick={() => handleBuy(pkg)}
                                                    disabled={loadingId === pkg.id}
                                                    className={button({ intent: "primary", size: "medium", className: "h-10 px-6 text-sm" })}
                                                >
                                                    {loadingId === pkg.id ? "در حال پردازش..." : "خرید پکیج"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </BlurTransition>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}