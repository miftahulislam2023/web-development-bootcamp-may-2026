"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import { login, signup } from "@/api/auth"
import { redirect, useRouter } from "next/navigation"
import { useStoreActions } from "easy-peasy"
import { setToken } from "@/utils/token"
import axios from "axios"
import { toast } from "sonner"


type LoginInputs = {
    email: string;
    password: string;
}

type SignupInputs = {
    name: string,
    confirmPassword: string,
} & LoginInputs

const useAuth = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<SignupInputs>()
    const loginState = useStoreActions((state: any) => state.auth.login)
    const router = useRouter();

    const onSubmitLogin: SubmitHandler<LoginInputs> = async (data) => {
        try {
            const d = await login(data);
            setToken(d.token);
            loginState({ ...d.user, token: d.token })
            toast.success("Login successful");
            redirect('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errors = error?.response?.data?.errors as Record<string, { msg: string }>;

                Object.entries(errors || {}).forEach(([path, { msg }]) => {

                    setError(path as keyof LoginInputs, {
                        type: "server",
                        message: msg
                    })
                })
            } else {
                console.log(error instanceof Error ? error.message : 'Login failed')
            }
        }
    }

    const onSubmitSignup: SubmitHandler<SignupInputs> = async (data) => {
        try {
            await signup(data);
            toast.success("Account created successfully");
            router.push('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errors = error?.response?.data?.errors as Record<string, { msg: string }>;

                Object.entries(errors || {}).forEach(([path, { msg }]) => {

                    setError(path as keyof SignupInputs, {
                        type: "server",
                        message: msg
                    })
                })
            } else {
                throw Error(error instanceof Error ? error.message : 'Login failed')
            }
        }
    }

    const submitLogin = handleSubmit(onSubmitLogin);
    const submitSignup = handleSubmit(onSubmitSignup);

    return { register, errors, submitLogin, submitSignup }
}

export default useAuth