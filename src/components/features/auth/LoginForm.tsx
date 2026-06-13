"use client";

import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        });

        if (res?.error) {
            setLoading(false);
            toast.error("Login Failed", {
                description: "Please check your credentials and try again."
            });
        } else {
            router.push("/dashboard");
        }
    };

    const TRANSITION = "transition-all duration-700 ease-out";
    const HIDDEN = "opacity-0 translate-y-4";
    const VISIBLE = "opacity-100 translate-y-0";
    const INPUT_STYLE = "w-full bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 h-[52px] rounded-full px-6 text-base transition-colors duration-200 shadow-none";
    const BUTTON_STYLE = "group w-full inline-flex items-center justify-center gap-2 pl-[14px] pr-[16px] py-[14px] rounded-[10px] text-[14px] font-medium leading-none text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 active:scale-[0.98] shadow-none [&_svg]:translate-y-[1px]";

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="w-full max-w-md z-10">
                <div className="text-center">
                    <h1
                        className={cn(
                            "font-serif text-4xl sm:text-5xl text-gray-900 mb-2 leading-[1.1]",
                            TRANSITION,
                            mounted ? VISIBLE : HIDDEN
                        )}
                        style={{ transitionDelay: '100ms' }}
                    >
                        Welcome <span className="text-indigo-600">Back.</span>
                    </h1>

                    <p
                        className={cn(
                            "text-lg text-gray-500 mb-10 max-w-xs mx-auto",
                            TRANSITION,
                            mounted ? VISIBLE : HIDDEN
                        )}
                        style={{ transitionDelay: '200ms' }}
                    >
                        Sign in to manage your stunning apps & websites.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className={cn(
                            "flex flex-col gap-4 max-w-sm mx-auto",
                            TRANSITION,
                            mounted ? VISIBLE : HIDDEN
                        )}
                        style={{ transitionDelay: '300ms' }}
                    >
                        <div className="group relative">
                            <User className="absolute left-6 top-[16px] h-5 w-5 pointer-events-none transition-colors text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className={cn(INPUT_STYLE, "pl-14")}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="group relative">
                            <Lock className="absolute left-6 top-[16px] h-5 w-5 pointer-events-none transition-colors text-gray-400" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(INPUT_STYLE, "pl-14 pr-14")}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-[16px] text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={remember}
                                    onCheckedChange={(checked) => setRemember(checked as boolean)}
                                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 border-gray-300"
                                />
                                <Label 
                                    htmlFor="remember" 
                                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition-colors font-normal"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={cn(BUTTON_STYLE, loading && "opacity-80 cursor-not-allowed")}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div
                        className={cn(
                            "mt-12",
                            TRANSITION,
                            mounted ? VISIBLE : HIDDEN
                        )}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <a href="/" className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
                            <ArrowRight size={14} className="rotate-180 transition-transform group-hover:-translate-x-1" />
                            <span>Return to Home</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent z-0" />
        </section>
    );
}