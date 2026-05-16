import { useNavigate } from 'react-router';
import { House, MoveLeft } from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import ErrorImg from '../assets/error-404.png';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center px-4 text-center py-20">
                <img 
                    src={ErrorImg} 
                    alt="404 Error" 
                    className="w-64 sm:w-80 max-w-full mb-8 animate-bounce-slow"
                />
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
                    Oops, page not found!
                </h1>
                
                <p className="mt-4 text-base-content/60 text-sm sm:text-base max-w-md">
                    The page you are looking for is not available. Please check the URL or return to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline border-2 border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:border-blue-700 font-semibold px-6 transition-all duration-200 flex items-center gap-2"
                    >
                        <MoveLeft size={18} />
                        Go Back
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="btn bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none font-semibold px-6 hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    >
                        <House size={18} />
                        Go Home
                    </button>
                </div>

                <p className="mt-10 text-xs text-base-content/30 font-semibold uppercase tracking-widest">
                    Cashnivo - Expense Tracker
                </p>
            </div>
            <Footer />
        </>
    );
};

export default ErrorPage;
