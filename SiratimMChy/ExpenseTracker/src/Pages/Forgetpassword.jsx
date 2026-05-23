import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import auth from '../firebase/firebase.config';
import { useParams } from 'react-router';

const ForgetPassword = () => {
    const { email } = useParams();
    const handleSubmit = (e) => {
        e.preventDefault();
        const femail = e.target.email.value;
        sendPasswordResetEmail(auth, femail)
            .then(() => {
                toast.success('Password reset email sent! Please check your inbox.');
                window.open('https://mail.google.com/mail/u/0/');
            })
            .catch((error) => { toast.error(error.message); });
    }
    return (
        <div className='flex items-center justify-center pt-25 pb-45'>
            <form onSubmit={handleSubmit} className="fieldset bg-linear-to-r from-blue-50 to-blue-100 border-base-300 rounded-box w-sm border p-4 px-8">
                <fieldset className="fieldset">
                    <label className="label text-black text-sm font-semibold">Email</label>
                    <input defaultValue={email} name='email' type="email" className="input validator" placeholder="Enter Your Email" required />
                    <p className="validator-hint hidden">Required</p>
                    <button className="btn bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold mt-4" type="submit">Send</button>
                </fieldset>
            </form>
        </div>
    );
};

export default ForgetPassword;