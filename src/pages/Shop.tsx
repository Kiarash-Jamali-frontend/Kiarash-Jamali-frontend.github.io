import { useEffect, useState } from "react";
import button from "../cva/button";
import supabase from "../supabase/client";
import toast from "react-hot-toast";
import type { Tables } from "../../database.types";
import Header from "../components/Header";

export default function Shop() {
    const [packages, setPackages] = useState<Tables<'test_package'>[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchPackages();
    }, []);

    async function fetchPackages() {
        const { data } = await supabase.from('test_package').select('*');
        if (data) setPackages(data);
    }

    const handleBuy = async (pkg: Tables<'test_package'>) => {
        // در اینجا منطق چک کردن سکه و کسر آن از دیتابیس قرار می‌گیرد
        setLoadingId(pkg.id);

        // شبیه‌سازی خرید
        setTimeout(() => {
            toast.success(`بسته ${pkg.name} با موفقیت خریداری شد`);
            setLoadingId(null);
        }, 1500);
    };

    return (
        <div className="flex flex-col grow">
            <Header />
            <div className="space-y-5 mt-8">
                {/* هدر فروشگاه و نمایش سکه */}
                <h1 className="text-2xl font-bold text-natural">فروشگاه آزمون</h1>

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
            </div>
        </div>
    );
}