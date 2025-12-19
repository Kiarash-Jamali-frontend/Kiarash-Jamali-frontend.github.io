import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserStore, { type UserState } from "../stores/user"
import { faUser, faCoins, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import { calculateLevel } from "../utils/helpers";

export default function Header() {

    const { user, coins,subscriptions } = useUserStore((state: UserState) => state);
    const fullSubscription = subscriptions.find((s) => s.isFullSubscription);

    const xp = user?.user_metadata?.xp ?? 0;
    const xpString = xp.toLocaleString("fa-IR");
    const level = calculateLevel(xp);

    return (
        <header className="z-10 sticky top-4 shadow-lg flex items-center justify-between bg-secondary/60 backdrop-blur-lg rounded-xl border p-3">
            <Link to={"/settings"} viewTransition className="flex items-center gap-x-2">
                {user?.user_metadata?.profileImage ? (
                    <img
                        src={user.user_metadata.profileImage as string}
                        alt={user?.user_metadata?.name as string}
                        className="size-9 rounded-full border object-cover"
                    />
                ) : (
                    <div className="size-9 rounded-full border grid place-items-center">
                        <FontAwesomeIcon icon={faUser} className="text-natural/60" />
                    </div>
                )}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                        {user?.user_metadata?.name}
                    </span>
                    {fullSubscription && (
                        <span className="text-[0.6rem] text-yellow-500 font-semibold mt-1">
                            {fullSubscription.name}
                        </span>
                    )}
                </div>
            </Link>
            <div className="flex items-stretch flex-wrap justify-end gap-x-2">
                <div className="flex items-center gap-x-1.5 px-2 py-1 bg-base border rounded-lg">
                    <span className="text-xs font-medium">{coins.toLocaleString("fa-IR")}</span>
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-500 text-xs" />
                </div>
                <div className="flex items-center gap-x-1.5 px-2 py-1 bg-base border rounded-lg">
                    <span className="text-xs font-medium">{xpString}</span>
                    <span className="text-sm font-bold text-primary">
                        XP
                    </span>
                </div>
                <div className="flex items-center gap-x-1.5 px-2 py-1 bg-base border rounded-lg">
                    <span className="text-xs font-medium">Lv.{level.toLocaleString("fa-IR")}</span>
                    <FontAwesomeIcon icon={faChartLine} className="text-green-500 text-xs" />
                </div>
            </div>
        </header>
    )
}