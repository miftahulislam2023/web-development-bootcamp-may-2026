
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router';
import auth from '../firebase/firebase.config';
import { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { FcGoogle } from "react-icons/fc";
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const { setUser, handleSignupWithGoogle } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.state ? location.state : '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user)
                toast.success('Login successful!');
                navigate(path);
            })
            .catch(() => {
              toast.error('Please try to log in with your Google account.');
            });
    }

    const SignInWithGoogle = async () => {
        try {
            const result = await handleSignupWithGoogle();

            const user = result.user;

            const userData = {
                name: user.displayName,
                email: user.email,
                imageUrl: user.photoURL,
            };
            await axios.post('https://cashnivo.vercel.app/users', userData);

            setUser(user);

            toast.success('Google login successful!');

            navigate(path);

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const hanldeforget = (e) => {
        e.preventDefault();
        const emailInput = e.target.form.email.value;
        if (!emailInput) {
            toast.error('Please enter your email first');
            return;
        }
        navigate(`/forgetpassword/${emailInput}`);
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-4 py-8 bg-base-100'>
            <title>Login</title>

            <div className="w-full max-w-md -mt-20">
                {/* Card Container */}
                <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-8 py-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                        <p className="text-white/90 text-sm">Continue tracking your expenses with Cashnivo</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email Address
                                </span>
                            </label>
                            <input
                                name='email'
                                type="email"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    Password
                                </span>
                            </label>
                            <input
                                name='password'
                                type="password"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={hanldeforget}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="btn bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold w-full border-none shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Login
                        </button>

                        {/* Divider */}
                        <div className="divider text-sm text-base-content/60">OR</div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={SignInWithGoogle}
                            className="btn btn-outline w-full hover:bg-base-200 border-2 hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">Continue with Google</span>
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4 border-t border-base-content/10">
                            <p className="text-sm text-base-content/70">
                                Don't have an account?{' '}
                                <Link
                                    className='text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all'
                                    to="/register"
                                >
                                    Register Now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;