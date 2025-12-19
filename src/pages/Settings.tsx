import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faMoon, faSun, faDesktop, faGraduationCap, faUser, faChevronLeft, faSignOut } from "@fortawesome/free-solid-svg-icons";
import useUserStore from "../stores/user";
import useThemeStore from "../stores/theme";
import useGradeStore from "../stores/grade";
import button from "../cva/button";
import input from "../cva/input";
import supabase from "../supabase/client";
import toast from "react-hot-toast";
import { GRADE_LABELS } from "../constants/gridLabels";
import { Link, useNavigate } from "react-router";
import BlurTransition from "../components/BlurTransition";

export default function Settings() {
    const { user, fetchProfile } = useUserStore();
    const { mode, setMode } = useThemeStore();
    const { grade, setGrade } = useGradeStore();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.user_metadata?.name || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profileImageUrl = user?.user_metadata.profileImage;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // ولیدیشن حجم فایل
            return toast.error("حجم عکس نباید بیشتر از ۲ مگابایت باشد");
        }

        setIsUpdating(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(fileName, file);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('profile_images').getPublicUrl(fileName);
            await supabase.auth.updateUser({ data: { profileImage: publicUrl } });
            await fetchProfile();
            toast.success("عکس پروفایل به‌روز شد");
        }
        setIsUpdating(false);
    };

    const handleSave = async () => {
        if (name.trim().length < 3) return toast.error("نام کوتاه است");
        setIsUpdating(true);
        const { error } = await supabase.auth.updateUser({ data: { name } });
        if (!error) { toast.success("ذخیره شد"); fetchProfile(); }
        setIsUpdating(false);
    };

    const handleLogout = () => {
        supabase.auth.signOut();
        localStorage.clear();
        navigate("/intro");
    }

    return (
        <BlurTransition className="flex flex-col gap-y-4 mt-5">
            {/* بخش آواتار */}
            <div className="flex flex-col items-center gap-y-3 bg-secondary p-6 rounded-xl border border-zinc-200 dark:border-white/10">
                <div className="relative size-24">
                    {
                        profileImageUrl ? (
                            <img src={profileImageUrl}
                                className="size-full rounded-full object-cover border-4 border-primary/20" />
                        ) : (
                            <div className="size-full rounded-full border grid place-items-center">
                                <FontAwesomeIcon icon={faUser} size="2xl" className="text-natural/60" />
                            </div>
                        )
                    }
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-secondary"><FontAwesomeIcon icon={faCamera} size="sm" /></button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="text-center">
                    <h2 className="font-bold text-natural">{user?.user_metadata?.name}</h2>
                    <p className="text-xs text-natural/50 mt-1" dir="ltr">{user?.phone}</p>
                </div>
                <div className="w-full">
                    <label className="text-xs font-bold text-natural/60 mr-1" htmlFor="name">نام و نام‌خانوادگی</label>
                    <input id="name" className={input({ size: "md" })} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <button onClick={handleSave} disabled={isUpdating} className={button({ className: "w-full rounded-2xl" })}>
                    بروزرسانی پروفایل
                </button>
            </div>

            <Link to={`/full-subscription/${grade}`} className="p-4 flex items-center justify-between bg-purple-600 text-white rounded-xl">
                <div className="font-bold">
                    خرید اشتراک کامل {GRADE_LABELS[grade]}
                </div>
                <FontAwesomeIcon icon={faChevronLeft} />
            </Link>

            {/* تم برنامه (سه حالته) */}
            <div className="bg-secondary p-5 rounded-xl border border-zinc-200 dark:border-white/10 space-y-4">
                <span className="text-sm font-bold text-natural/70 flex items-center gap-x-2">
                    تم برنامه
                </span>
                <div className="grid grid-cols-3 gap-2 bg-base p-1.5 rounded-2xl">
                    {[
                        { id: 'system', icon: faDesktop, label: 'خودکار' },
                        { id: 'light', icon: faSun, label: 'روشن' },
                        { id: 'dark', icon: faMoon, label: 'تاریک' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setMode(item.id as any)}
                            className={`flex flex-col items-center gap-y-1 py-2 rounded-xl transition-all ${mode === item.id ? "bg-secondary shadow-sm text-primary border border-zinc-200 dark:border-white/10" : "text-natural/40"}`}
                        >
                            <FontAwesomeIcon icon={item.icon} size="sm" />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* انتخاب پایه تحصیلی */}
            <div className="bg-secondary p-5 rounded-xl border border-zinc-200 dark:border-white/10 space-y-4">
                <span className="text-sm font-bold text-natural/70 flex items-center gap-x-2">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-primary" /> پایه تحصیلی
                </span>
                <div className="grid grid-cols-3 gap-2">
                    {([10, 11, 12] as const).map((g) => (
                        <button
                            key={g}
                            onClick={() => setGrade(g)}
                            className={`py-3 rounded-2xl font-black transition-all border-2 ${grade === g ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-base text-natural/40"}`}
                        >
                            {g}اُم
                        </button>
                    ))}
                </div>
            </div>

            <button className={button({ intent: "dangerOutline" })} onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOut} className="me-2" />
                خروج از حساب کاربری
            </button>
        </BlurTransition>
    );
}