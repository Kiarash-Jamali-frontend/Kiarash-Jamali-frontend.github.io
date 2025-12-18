import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import OtpInput from "react-otp-input";
// import supabase from "../supabase/client";
import input from "../cva/input";
import button from "../cva/button";
import useUserStore, { /*type User,*/ type UserActions, type UserState } from "../stores/user";
import { toast } from "react-hot-toast";

type Step = "phone" | "otp";

export default function Auth() {
    const navigate = useNavigate();
    const { setUser } = useUserStore((state: UserState & UserActions) => state);

    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const validatePhone = (value: string) => {
        if (!/^09\d{9}$/.test(value)) {
            return "شماره تلفن باید ۱۱ رقم باشد و با ۰۹ شروع شود.";
        }
        return null;
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validatePhone(phone);
        setPhoneError(error);
        if (error) return;

        setIsLoading(true);
        try {
            // const { error: sendError } = await supabase.auth.signInWithOtp({
            //     phone,
            // });

            // if (sendError) {
            //     toast.error(sendError.message || "ارسال کد با خطا مواجه شد.");
            //     return;
            // }

            toast.success("کد تأیید برای شما ارسال شد.");
            setStep("otp");
            setTimer(60);
        } catch {
            toast.error("مشکلی در ارتباط با سرور پیش آمد.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (step === "otp" && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("کد تأیید باید ۶ رقم باشد.");
            return;
        }

        setIsLoading(true);
        try {
            // const { data, error: verifyError } = await supabase.auth.verifyOtp({
            //     phone,
            //     token: otp,
            //     type: "sms",
            // });

            // if (verifyError || !data.session || !data.user) {
            //     toast.error(verifyError?.message || "کد تأیید نامعتبر است.");
            //     return;
            // }

            // const newUser: User = {
            //     id: data.user.id,
            //     phone: data.user.phone ?? null,
            // };
            setUser({ id: "1", app_metadata: {}, aud: "", created_at: "0", user_metadata: { name: "کیارش", profileImage: "", xp: 350, coin: 30 }, phone: "09336041238", });
            toast.success("با موفقیت وارد شدی!");
            navigate("/", { viewTransition: true });
        } catch {
            toast.error("مشکلی در ارتباط با سرور پیش آمد.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-5 flex flex-col grow gap-y-4">
            <div className="flex items-center mb-2 gap-x-2.5">
                <button
                    type="button"
                    onClick={() => {
                        if (step === "otp") {
                            setStep("phone");
                            setOtp("");
                            setTimer(60);
                        } else {
                            navigate(-1);
                        }
                    }}
                    className="size-8 rounded-full bg-secondary border grid place-items-center"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <h2 className="text-2xl font-bold">
                    {step === "phone" ? "ورود به حساب کاربری" : "تأیید کد ارسال‌شده"}
                </h2>
            </div>

            {step === "phone" && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-y-4 grow mt-2">
                    <p className="text-natural/60 text-sm">
                        برای شروع، شماره موبایلی رو وارد کن که همیشه در دسترست هست تا کد ورود برات ارسال بشه.
                    </p>
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-medium text-natural">شماره موبایل</label>
                        <input
                            type="tel"
                            dir="ltr"
                            inputMode="numeric"
                            maxLength={11}
                            className={input({ state: phoneError ? "error" : "default" })}
                            placeholder="مثلاً 09123456789"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                setPhone(value);
                                if (phoneError) setPhoneError(null);
                            }}
                        />
                        {phoneError && (
                            <span className="text-xs text-red-500 mt-0.5">{phoneError}</span>
                        )}
                    </div>
                    <div className="mt-auto">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={button({
                                className: "w-full mt-2",
                                disabled: isLoading,
                            })}
                        >
                            {isLoading ? "در حال ارسال..." : "ارسال کد تأیید"}
                        </button>
                    </div>
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-y-4 grow mt-2">
                    <p className="text-natural/60 text-sm">
                        کد ۶ رقمی که به شماره {phone} ارسال شده رو وارد کن تا وارد حسابت بشی.
                    </p>
                    <div className="flex flex-col gap-y-3">
                        <label className="text-sm font-medium text-natural">کد تأیید</label>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props: React.InputHTMLAttributes<HTMLInputElement>) => (
                                <input
                                    {...props}
                                    className="size-10! aspect-square rounded-xl border-2 bg-secondary text-natural text-center text-lg font-semibold focus:border-primary focus:outline-none transition-colors duration-200"
                                />
                            )}
                            containerStyle={{
                                display: "flex",
                                gap: "0.5rem",
                                justifyContent: "center",
                                width: "100%",
                                direction: "ltr"
                            }}
                            inputStyle={{
                                borderColor: "rgb(229 231 235)",
                            }}
                        />
                        {timer > 0 ? (
                            <p className="text-xs text-natural/60 text-center">
                                ارسال مجدد کد در {timer} ثانیه
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={async () => {
                                    const error = validatePhone(phone);
                                    if (error) {
                                        toast.error(error);
                                        return;
                                    }
                                    setIsLoading(true);
                                    try {
                                        // const { error: sendError } = await supabase.auth.signInWithOtp({
                                        //     phone,
                                        // });
                                        // if (sendError) {
                                        //     toast.error(sendError.message || "ارسال کد با خطا مواجه شد.");
                                        //     return;
                                        // }
                                        toast.success("کد تأیید مجدداً برای شما ارسال شد.");
                                        setTimer(60);
                                    } catch {
                                        toast.error("مشکلی در ارتباط با سرور پیش آمد.");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="text-xs text-primary font-medium hover:underline"
                                disabled={isLoading}
                            >
                                ارسال مجدد کد
                            </button>
                        )}
                    </div>
                    <div className="mt-auto">
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className={button({
                                className: "w-full mt-2",
                                disabled: isLoading || otp.length !== 6,
                            })}
                        >
                            {isLoading ? "در حال ورود..." : "ورود به حساب"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}


