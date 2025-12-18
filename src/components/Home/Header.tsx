import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserStore, { type UserState } from "../../stores/user"
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {

    const { user } = useUserStore((state: UserState) => state);

    return (
        <header className="flex items-center justify-between bg-secondary rounded-xl border p-3">
            <div className="flex items-center gap-x-2">
                {user?.user_metadata.profileImage ? (
                    <img />
                ) : (
                    <div className="size-9 rounded-full border grid place-items-center">
                        <FontAwesomeIcon icon={faUser} className="text-natural/60" />
                    </div>
                )}
                <span className="text-sm">
                    {user?.user_metadata.name}
                </span>
            </div>
            <div>

            </div>
        </header>
    )
}