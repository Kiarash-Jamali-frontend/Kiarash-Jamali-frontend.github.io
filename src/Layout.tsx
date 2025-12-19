import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useIntroStore, { type IntroState } from "./stores/intro";
import useThemeDetector from "./hooks/useThemeDetector";
import useThemeStore, { type ThemeState, type ThemeActions } from "./stores/theme";
import useUserStore, { type UserActions, type UserState } from "./stores/user";
import Navbar from "./components/Navbar";
// import supabase from "./supabase/client";

export default function Layout() {
    const systemPrefersDark = useThemeDetector();
    const { mode } = useThemeStore((state: ThemeState & ThemeActions) => state);
    const isDarkTheme = (mode === "system" ? systemPrefersDark : mode === "dark");
    const { checked } = useIntroStore((state: IntroState) => state);
    const { user, isLoading, setUser, setLoading } = useUserStore((state: UserState & UserActions) => state);
    const { pathname } = useLocation();
    const publicRoutes: string[] = ['/auth','/intro','/theme','/grade'];

    useEffect(() => {
        // supabase.auth.getUser().then(({ data }) => {
        //     if (data.user) {
        //         setUser(data.user);
        //     } else {
        //         setUser(null);
        //     }
        // }).catch(() => {
        //     setUser(null);
        // });
        setLoading(false);
    }, [setUser]);

    if (!checked && !pathname.startsWith("/intro")) {
        return <Navigate to={"/intro"} />
    }

    if (isLoading) {
        return (
            <div className="bg-base min-h-screen grid place-items-center">
                <div className="flex gap-x-2.5 items-center py-3 px-4 border rounded-xl bg-secondary">
                    <div className="rounded-full size-8 animate-spin border-r-transparent border-4 border-primary">

                    </div>
                    <div className="font-bold text-sm text-primary">
                        در حال بارگذاری ...
                    </div>
                </div>
            </div>
        );
    }

    if (!user && publicRoutes.every((r) => !pathname.startsWith(r))) {
        return <Navigate to={"/auth"} />
    }

    const showNavbar = !publicRoutes.some((r) => pathname.startsWith(r)) && user;

    return (
        <div className={`${isDarkTheme ? "dark" : ""} bg-base`}>
            <div className="max-w-md mx-auto min-h-screen flex flex-col">
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
                {showNavbar && <Navbar />}
            </div>
        </div>
    )
}