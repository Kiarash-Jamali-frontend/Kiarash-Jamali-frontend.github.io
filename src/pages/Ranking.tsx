import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import useRankingStore from "../stores/ranking";
import useUserStore from "../stores/user";
import BlurTransition from "../components/BlurTransition";

export default function Ranking() {
    const { topUsers, isLoading } = useRankingStore();
    const { user: currentUser } = useUserStore();
    const parentRef = useRef<HTMLDivElement>(null);

    // راه‌اندازی مجازی‌ساز برای لیست‌های طولانی
    const rowVirtualizer = useVirtualizer({
        count: topUsers.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72, // ارتفاع تقریبی هر آیتم
        overscan: 5,
    });

    // پیدا کردن رتبه کاربر فعلی
    const currentUserRank = topUsers.find(u => u.userId === currentUser!.id);

    if (isLoading) return <div className="text-center p-10 font-bold">در حال دریافت رتبه‌بندی...</div>;

    return (
        <BlurTransition className="flex flex-col mt-6">
            <div className="flex items-center gap-x-3 mb-6 px-2">
                <div className="size-12 bg-amber-500/20 text-amber-500 rounded-2xl grid place-items-center">
                    <FontAwesomeIcon icon={faTrophy} size="lg" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-natural">برترین‌های تراز</h1>
                    <p className="text-xs text-natural/50">رقابت بر سر XP و رتبه علمی</p>
                </div>
            </div>

            {/* لیست مجازی */}
            <div
                ref={parentRef}
                className="flex-1 overflow-auto rounded-3xl bg-secondary/30 border border-zinc-200 dark:border-white/5 p-2 custom-scrollbar"
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const person = topUsers[virtualRow.index];
                        const isMe = person.userId === currentUser?.id;

                        return (
                            <div
                                key={virtualRow.index}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className="p-1"
                            >
                                <div className={`
                                    flex items-center gap-x-4 px-4 h-full rounded-2xl border transition-all
                                    ${isMe
                                        ? "bg-primary text-white border-primary shadow-lg scale-[1.02] z-10"
                                        : "bg-secondary border-zinc-200 dark:border-white/5"}
                                `}>
                                    {/* رتبه */}
                                    <div className="w-8 flex justify-center font-black italic">
                                        {person.rank === 1 ? <FontAwesomeIcon icon={faMedal} className="text-yellow-400 text-xl" /> :
                                            person.rank === 2 ? <FontAwesomeIcon icon={faMedal} className="text-gray-300 text-xl" /> :
                                                person.rank === 3 ? <FontAwesomeIcon icon={faMedal} className="text-amber-700 text-xl" /> :
                                                    person.rank}
                                    </div>

                                    {/* آواتار */}
                                    {
                                        person.profileImage ? (
                                            <img
                                                src={person.profileImage}
                                                className="size-10 rounded-full object-cover border-2 border-white/20"
                                            />
                                        ) : (
                                            <div className="size-10 rounded-full border grid place-items-center">
                                                <FontAwesomeIcon icon={faUser} size="lg" className={isMe ? "text-white" : "text-natural"} />
                                            </div>
                                        )
                                    }

                                    {/* اطلاعات */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm truncate">{person.name}</h3>
                                        <div className={`text-[10px] ${isMe ? "text-white/70" : "text-natural/50"}`}>
                                            سطح کاربری {(Math.floor(person.xp / 100) + 1).toLocaleString("fa-IR")}
                                        </div>
                                    </div>

                                    {/* مقدار XP */}
                                    <div className="flex items-center gap-x-1.5 bg-black/10 px-3 py-1 rounded-full text-xs font-medium">
                                        <span>{person.xp.toLocaleString("fa-IR")}</span>
                                        <FontAwesomeIcon icon={faStar} className={isMe ? "text-white" : "text-amber-500"} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* باکس شناور کاربر (اگر در لیست گم شد) */}
            {!rowVirtualizer.getVirtualItems().some(i => topUsers[i.index].userId === currentUser?.id) && currentUserRank && (
                <div className="mt-4 animate-bounce">
                    <div className="bg-primary text-white p-4 rounded-2xl flex items-center justify-between shadow-xl border-2 border-white/20">
                        <div className="flex items-center gap-x-3">
                            <span className="font-black italic text-lg">#{currentUserRank.rank}</span>
                            <span className="text-sm font-bold">رتبه شما در کل کاربران</span>
                        </div>
                        <div className="font-black">{currentUserRank.xp} XP</div>
                    </div>
                </div>
            )}
        </BlurTransition>
    );
}