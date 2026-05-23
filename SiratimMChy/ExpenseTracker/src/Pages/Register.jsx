import { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { updateProfile, signOut } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { User, Mail, Image, Lock } from 'lucide-react';
import axios from 'axios';
import auth from '../firebase/firebase.config';

const Register = () => {
    const { createUser, setUser, handleSignupWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value;
        const photoUrl = e.target.photoUrl;
        const file = photoUrl.files[0];

        const uppercase = /[A-Z]/;
        const lowercase = /[a-z]/;

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }
        if (!uppercase.test(password)) {
            toast.error('Password must contain at least one uppercase letter.');
            return;
        }
        if (!lowercase.test(password)) {
            toast.error('Password must contain at least one lowercase letter.');
            return;
        }


        const res = await axios.post(`https://api.imgbb.com/1/upload?key=d6d69d6d3d1835a58c3edf001ecc0c25`,
            { image: file },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        const imageUrl = res.data.data.display_url;

        const formData = {
            email,
            name,
            imageUrl,
            password,
        }


        if (res.data.success === true) {
            createUser(email, password)
                .then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: name, photoURL: imageUrl
                    }).then(() => {
                        axios.post('https://cashnivo.vercel.app/users', formData)
                            .then(res => {
                                console.log(res.data);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                        
                        // Sign out the user after registration
                        signOut(auth).then(() => {
                            toast.success('Registration successful! Please login.');
                            navigate('/login');
                        }).catch((error) => {
                            console.log(error);
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                })
                .catch(() => {
                    toast.error('User email is already exist');
                })
        }
    }

    const SignUpWithGoogle = async () => {
        try {
            const result = await handleSignupWithGoogle();

            if (!result?.user) return;

            const user = result.user;

            const userData = {
                name: user.displayName,
                email: user.email,
                imageUrl: user.photoURL,
            };

            await axios.post('https://cashnivo.vercel.app/users', userData);

            setUser(user);

            toast.success('Google signup successful!');

            navigate('/');
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    return (
        <div className='flex items-center justify-center min-h-screen px-4 py-8 bg-base-100'>
            <title>Registration</title>

            <div className="w-full max-w-md -mt-5">
                {/* Card Container */}
                <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-8 py-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-white/90 text-sm">Start managing your expenses smarter with Cashnivo</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-4">
                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Full Name
                                </span>
                            </label>
                            <input
                                name='name'
                                type="text"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

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

                        {/* Photo Upload Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    Profile Photo
                                </span>
                            </label>
                            <input
                                name='photoUrl'
                                type="file"
                                className="file-input file-input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                accept="image/*"
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
                                placeholder="Create a strong password"
                                required
                            />
                            <label className="label">
                                <span className="label-text-alt text-xs text-base-content/60">
                                    Must be 6+ characters with uppercase & lowercase
                                </span>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            className="btn bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold w-full border-none shadow-md hover:shadow-lg transition-all duration-300"
                            type="submit"
                        >
                            Register
                        </button>

                        {/* Divider */}
                        <div className="divider text-sm text-base-content/60">OR</div>

                        {/* Google Sign Up */}
                        <button
                            onClick={SignUpWithGoogle}
                            type="button"
                            className="btn btn-outline w-full hover:bg-base-200 border-2 hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">Continue with Google</span>
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-base-content/10">
                            <p className="text-sm text-base-content/70">
                                Already have an account?{' '}
                                <Link
                                    className='text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all'
                                    to="/login"
                                >
                                    Login Now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
