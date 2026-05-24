"use client"

import axios from 'axios';
import { ArrowRight, ChevronLeft, Loader2, Lock } from 'lucide-react'
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { useAppData, user_service } from '@/context/AppContext';
import Loading from './Loading';
import toast from 'react-hot-toast';

const VerifyOtp = () => {

    const { isAuth, setIsAuth, setUser, loading: userLoading, fetchUsers } = useAppData();

    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState<string>("");
    const [resending, setResending] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(60);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);


    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    const handleInputChange = (index: number, value: string): void => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();

        const pasteData = e.clipboardData.getData("Text").trim();
        const digits = pasteData.replace(/\D/g, "").slice(0, 6);
        if (digits.length === 6) {
            const newOtp = digits.split("");
            setOtp(newOtp);
            setError("");
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter the complete 6 digit OTP");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post(`${user_service}/api/user/verify`, { email, otp: otpString });

            toast.success(data.message);
            Cookies.set("token", data.token, {
                expires: 15,
                secure: true,
                path: "/"
            });
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            // router.push("/chat");
            setUser(data.user);
            setIsAuth(true);
            // fetchChats();
            fetchUsers();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "An error occurred while verifying OTP"
                );
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleResentOtp = async (): Promise<void> => {
        setResending(true);
        setError("");
        try {
            const { data } = await axios.post(`${user_service}/api/user/login`, { email });
            toast.success(data.message);
            setTimer(60);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "An error occurred while resending OTP"
                );
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setResending(false);
        }
    };

    if (userLoading) {
        return <Loading />;
    }

    if(isAuth) {
        redirect("/chat");
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                    <div className="text-center mb-8 relative">
                        <button className='absolute left-0 top-0 p-2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300'
                            onClick={() => router.push("/login")}>
                            <ChevronLeft className='w-6 h-6' />
                        </button>
                        <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <Lock size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3">
                            Verify Your Email
                        </h1>
                        <p className="text-gray-400 text-lg">
                            We have sent a 6 digit code to
                        </p>
                        <p className="text-blue-500 font-medium">
                            {email}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-300 mb-4 text-center"
                            >
                                Enter your 6 digit OTP code below
                            </label>
                            <div className="flex justify-center in-checked: space-x-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el: HTMLInputElement | null) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        onChange={e => handleInputChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                        </div>

                        {
                            error && (
                                <div className='bg-red-900 border-red-700 rounded-b-lg p-3'>
                                    <p className="text-red-300 text-sm text-center">{error}</p>
                                </div>
                            )
                        }

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {
                                loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className='w-5 h-5' />
                                        Verifying...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Verify</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )
                            }
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm text-center mt-4">
                            Didn&apos;t receive the code?
                        </p>
                        {
                            timer > 0 ? (
                                <p className='text-gray-400 text-sm'>
                                    Resend OTP in {timer} seconds
                                </p>
                            ) : (
                                <button className='text-blue-400 hover:text-blue-300 font-medium text-sm disabled:opacity-50'
                                    disabled={resending}
                                    onClick={handleResentOtp}>
                                    {resending ? "Sending..." : "Resend OTP"}
                                </button>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default VerifyOtp