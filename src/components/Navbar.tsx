import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGamepad, faStore, faTrophy, faGear } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router";

type NavItem = {
    path: string;
    label: string;
    icon: typeof faHome;
};

const navItems: NavItem[] = [
    { path: "/", label: "خانه", icon: faHome },
    { path: "/todo", label: "To-Do", icon: faGamepad },
    { path: "/shop", label: "فروشگاه", icon: faStore },
    { path: "/settings", label: "تنظیمات", icon: faGear },
    { path: "/ranking", label: "رتبه‌بندی", icon: faTrophy },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="mt-4 sticky bottom-4 mx-4 shadow-lg bg-secondary/60 backdrop-blur-lg border rounded-xl p-1">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            viewTransition
                            className={`flex flex-col items-center gap-y-1.5 px-2 pt-2 pb-1.5 rounded-lg transition-colors min-w-15 ${
                                isActive
                                    ? "text-primary"
                                    : "text-natural/60 hover:text-natural/75"
                            }`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-lg" />
                            <span className="text-[0.65rem] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
