import button from "../cva/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import useIntroStore, { type IntroAction, type IntroState } from "../stores/intro";
import { useNavigate } from "react-router";
import BlurTransition from "../components/BlurTransition";

export default function Intro() {
    const { checkIntro } = useIntroStore((state: IntroState & IntroAction) => state);
    const navigate = useNavigate();

    const handleClick = () => {
        checkIntro();
        navigate("/theme", { viewTransition: true });
    };

    return (
        <BlurTransition className="flex flex-col grow">
            <div className="bg-zinc-400 border p-2 rounded-2xl">
                <video src="/intro.mp4" autoPlay controls className="rounded-xl w-full"></video>
            </div>
            <h2 className="text-3xl my-5 font-bold">به زیکو خوش اومدی!</h2>
            <p className="text-natural/60">
                با زیکو می‌تونی خیلی راحت امتحانات نهایی زبانت رو ۲۰ بگیری.
                <br />
                من اینجا هستم تا توی این مسیر قدم به قدم همراهت باشم و تو رو به این هدف برسونم.
            </p>
            <button
                className={button({ className: "w-full mt-auto" })}
                type="button"
                onClick={handleClick}
            >
                بزن بریم!
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        </BlurTransition>
    )
}