"use client"
import { ArrowRight, Loader2, Lock, ArrowLeft, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react'
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';  
import { useAppData, user_service } from '@/context/AppContext';
import Loading from './Loading';
import toast from 'react-hot-toast';


const VerifyOtp = () => {

  const { isAuth, setIsAuth, setUser, loading: userLoading,fetchChats,fetchUsers } = useAppData();
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [otp,setOtp] = useState<string[]>(["", "", "","","",""]);
  const [error, setError] = useState<string>("");
  const [timer,setTimer] = useState<number>(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const searchParams = useSearchParams();

  const email: string | null = searchParams.get("email");


  useEffect(() => {
    if(timer>0)
    {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      },1000);
      return () => clearInterval(interval);
    }
  },[timer]);


  const handleInputChange = (index: number, value: string): void => {
    if(value.length>1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("")



    if(value && index < 5)
    {
      inputRefs.current[index+1]?.focus();
    }
  };


  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if(e.key === 'Backspace' && !otp[index] && index > 0)
    {
      inputRefs.current[index-1]?.focus();
    }
  }


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void =>{
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text")
    const digits = pasteData.replace(/\D/g, '').slice(0, 6); 

    if(digits.length === 6)
    {
      setOtp(digits.split(""));
      inputRefs.current[5]?.focus();
    }

  }


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    if(otpString.length !== 6)
    {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const {data} = await axios.post(`${user_service}/api/v1/verify`,{
        otp: otpString, 
        email: email
      });
      toast.success(data.message);
      Cookies.set("token", data.token, {
          expires:15,
          secure: false,
          path:"/",
        }); 
        setOtp(["", "", "","","",""]);
        inputRefs.current[0]?.focus();
        setUser(data.user);
        setIsAuth(true);
        sessionStorage.removeItem('otpRequested');
        fetchChats();
        fetchUsers();
    } catch (error:any) {
      setError(error.response.data.message);
      
    }
    finally{
      setLoading(false);
    }

  };

  const handleResendOtp = async() => {
    if(timer>0) return;
    setResendLoading(true);
    try {
      await axios.post(`${user_service}/api/v1/login`,{email});
      setTimer(60);
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
    finally{
      setResendLoading(false);
    }
  };


  if(userLoading) return <Loading></Loading>
  if(isAuth) redirect("/chat");
  if(!email) redirect("/login");

  // Block direct URL access — must come from login page
  if(typeof window !== 'undefined' && !sessionStorage.getItem('otpRequested')) redirect("/login");

  return <div className='h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden'>
        {/* Mobile/Tablet - top illustration */}
        <div className='lg:hidden relative w-full h-[45vh] sm:h-[50vh] flex-shrink-0'>
            <Image src='/images/verify-logo.png' alt='Alapon' fill className='object-cover object-center' priority />
            <div className='absolute inset-0 bg-black/40' />
            <div className='absolute top-3 left-3 flex items-center gap-1.5'>
                <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center'>
                    <MessageCircle size={14} className='text-white'/>
                </div>
                <span className='text-white font-extrabold text-base tracking-wide'>Alapon</span>
            </div>
        </div>

        {/* Left Side - Illustration (desktop only) */}
        <div className='hidden lg:flex lg:w-1/2 relative'>
            <Image src='/images/verify-logo.png' alt='Alapon Logo' fill sizes='50vw' className='object-cover' priority />
            <div className='absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10'>
                <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                    <MessageCircle size={22} className='text-white'/>
                </div>
                <span className='text-white font-extrabold text-3xl tracking-wide'>Alapon</span>
            </div>
        </div>

        {/* Right Side - Verify Form */}
        <div className='w-full lg:w-1/2 flex-1 flex flex-col items-center justify-start pt-8 lg:justify-center px-5 sm:px-12 lg:px-20 bg-slate-950'>
            <div className='max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 p-6 sm:p-10'>
                <div className='mb-5'>
                    <div className='flex items-center justify-center relative mb-2'>
                        <button onClick={() => router.push('/login')} className='absolute left-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors'>
                          <ArrowLeft size={18} />
                        </button>
                        <h1 className='text-xl sm:text-3xl font-bold text-white'>Verify Email</h1>
                    </div>
                    <p className='text-gray-400 text-sm text-center'>We sent a 6-digit code to</p>
                    <p className='text-blue-400 font-medium text-center text-sm mt-1 truncate px-4'>{email}</p>
                </div>

                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-3 text-center'>Enter your 6 digit OTP</label>
                        <div className='flex justify-center gap-2'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className='w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-slate-600 rounded-lg bg-slate-800 text-white focus:border-blue-500 focus:outline-none transition-colors'
                                />
                            ))}
                        </div>
                    </div>
                    {error && (
                        <div className='bg-red-900/50 border border-red-700 rounded-lg p-3'>
                            <p className='text-red-300 text-sm text-center'>{error}</p>
                        </div>
                    )}
                    <button type='submit' className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors' disabled={loading}>
                        {loading ? (
                            <div className='flex items-center justify-center gap-2'>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-2'>
                                <span>Verify</span>
                                <ArrowRight className='w-4 h-4'/>
                            </div>
                        )}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <p className='text-gray-400 text-sm mb-1'>Didn't receive the code?</p>
                    {timer > 0
                        ? <p className='text-gray-500 text-sm'>Resend in {timer}s</p>
                        : <button onClick={handleResendOtp} className='text-blue-400 hover:text-blue-300 font-medium text-sm' disabled={resendLoading}>
                            {resendLoading ? 'Sending...' : 'Resend Code'}
                          </button>
                    }
                </div>
            </div>
        </div>
    </div>
}

export default VerifyOtp;