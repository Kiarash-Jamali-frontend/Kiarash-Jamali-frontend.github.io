import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserStore, { type UserState } from "../stores/user"
import { faUser, faCoins, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import { calculateLevel } from "../utils/helpers";
import { useEffect, useState } from "react";
import supabase from "../supabase/client";

export default function Header() {

    const { user } = useUserStore((state: UserState) => state);
    const [subscription, setSubscription] = useState<string|null>(null);

    const coins = (user?.user_metadata?.coins ?? 0).toLocaleString("fa-IR");
    const xp = user?.user_metadata?.xp ?? 0;
    const xpString = xp.toLocaleString("fa-IR");
    const level = calculateLevel(xp);

    useEffect(() => {
        if (!user?.id) {
            setSubscription(null);
            return;
        }

        const fetchSubscription = async () => {
            try {
                // First, get user's subscription
                const { data: userSubscription } = await supabase
                    .from("user_subscription")
                    .select("subscriptionId")
                    .maybeSingle();

                if (!userSubscription) {
                    setSubscription(null);
                    return;
                }

                const subscriptionId = userSubscription.subscriptionId;

                // Then, get subscription details
                const { data: subscriptionData } = await supabase
                    .from("subscription")
                    .select("name, isFullSubscription")
                    .eq("id", subscriptionId)
                    .maybeSingle();

                if (!subscriptionData) {
                    setSubscription(null);
                    return;
                }

                setSubscription(subscriptionData.name);
            } catch (error) {
                console.error("Error fetching subscription:", error);
                setSubscription(null);
            }
        };

        fetchSubscription();
    }, [user?.id]);

    return (
        <header className="z-10 sticky top-4 shadow-lg flex items-center justify-between bg-secondary/60 backdrop-blur-lg rounded-xl border p-3">
            <Link to={"/profile"} viewTransition className="flex items-center gap-x-2">
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
                    {subscription && (
                        <span className="text-[0.6rem] text-yellow-500 font-semibold mt-1">
                            {subscription}
                        </span>
                    )}
                </div>
            </Link>
            <div className="flex items-stretch gap-x-2">
                <div className="flex items-center gap-x-1.5 px-2 py-1 bg-base border rounded-lg">
                    <span className="text-xs font-medium">{coins}</span>
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