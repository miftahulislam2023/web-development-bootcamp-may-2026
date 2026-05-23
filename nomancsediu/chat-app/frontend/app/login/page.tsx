"use client";
import { ArrowRight, Loader2, Mail, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import React, {useState} from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppData , user_service} from '@/context/AppContext';
import Loading from '@/components/Loading';

const LoginPage = () => {

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const {isAuth, loading:userLoading} = useAppData();


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>):  Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const {data} = await axios.post(`${user_service}/api/v1/login`, {email});

            toast.success(data.message);
            sessionStorage.setItem('otpRequested', 'true');
            router.push(`/verify?email=${email}`);
            
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }

}

      if(userLoading) return <Loading/>
      if(isAuth) router.push('/chat')


    return  <div className='h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden'>
        {/* Mobile/Tablet - top illustration */}
        <div className='lg:hidden relative w-full h-[45vh] sm:h-[50vh] flex-shrink-0'>
            <Image src='/images/logo.png' alt='Alapon' fill className='object-cover object-center' priority />
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
            <Image
                src='/images/logo.png'
                alt='Alapon Logo'
                fill
                sizes='50vw'
                className='object-cover'
                priority
            />
            <div className='absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10'>
                <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                    <MessageCircle size={22} className='text-white'/>
                </div>
                <span className='text-white font-extrabold text-3xl tracking-wide'>Alapon</span>
            </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='w-full lg:w-1/2 flex-1 flex flex-col items-center justify-start pt-8 lg:justify-center px-5 sm:px-12 lg:px-20 bg-slate-950'>
            <div className='max-w-md w-full mx-auto bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 p-6 sm:p-10'>

                <div className='mb-7'>
                    <h1 className='text-2xl sm:text-4xl font-bold text-white mb-2'>
                        Welcome to Alapon
                    </h1>
                    <p className='text-gray-400 text-sm sm:text-lg'>
                        Enter your email to connect and chat
                    </p>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-2'>
                            Email Address
                        </label>
                        <div className='relative'>
                            <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                            <input type="email" id='email' className='w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
                            placeholder='Enter your email address'
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    disabled={loading}>
                        {loading ? (
                            <div className='flex items-center justify-center gap-2'>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                <span className='text-sm'>Sending OTP...</span>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-2'>
                                <span>Send Verification Code</span>
                                <ArrowRight className='w-4 h-4'/>
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    </div>
}
export default LoginPage;
