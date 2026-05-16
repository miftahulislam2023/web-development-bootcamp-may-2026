import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function LoginIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M15 12H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function RegisterIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M19 8v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M22 11h-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function AuthPage({ mode, message, onGoogleSubmit, onModeChange, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const googleButtonRef = useRef(null);
  const isLogin = mode === 'login';

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    function renderGoogleButton() {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          onGoogleSubmit(response.credential);
        }
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth || 320
      });
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [onGoogleSubmit]);

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      email,
      password
    });
  }

  function switchMode(nextMode) {
    setPassword('');
    onModeChange(nextMode);
  }

  return (
    <main className="min-h-screen bg-[#dfe7ef] px-4 py-8 text-[#111827]">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-5xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <div className="mb-10">
            <BrandLogo />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#64748b]">
            Messaging platform
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight text-[#111827]">
            Message privately, organize groups, and keep conversations moving.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#475569]">
            Sign in, choose a conversation, and keep messages organized without
            extra noise around the room.
          </p>
        </section>

        <section className="w-full rounded-lg border border-[#ccd6e0] bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div>
              <div className="mb-6 lg:hidden">
                <BrandLogo />
              </div>
              <p className="mb-1 text-sm font-medium text-[#64748b]">Welcome back</p>
              <h2 className="text-2xl font-semibold leading-tight text-[#111827]">
                {isLogin ? 'Login' : 'Create account'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                {isLogin
                  ? 'Enter your email and password to open the chat.'
                  : 'Create a small account before joining the chat.'}
              </p>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </span>
                  <input
                    className="input input-bordered w-full rounded-md border-[#d7dde4] bg-white text-[#111827] focus:border-[#2aabee]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  className="input input-bordered w-full rounded-md border-[#d7dde4] bg-white text-[#111827] focus:border-[#2aabee]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  className="input input-bordered w-full rounded-md border-[#d7dde4] bg-white text-[#111827] focus:border-[#2aabee]"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </label>

              {message && (
                <div className="alert alert-error rounded-md py-3 text-sm">
                  {message}
                </div>
              )}

              <button className="btn mt-2 w-full rounded-md border-[#2aabee] bg-[#2aabee] text-white hover:bg-[#229bd8]" type="submit">
                {isLogin ? <LoginIcon /> : <RegisterIcon />}
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="divider my-5 text-xs text-slate-400">or</div>

            {googleClientId ? (
              <div ref={googleButtonRef} className="flex min-h-11 justify-center" />
            ) : (
              <p className="rounded-md bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
                Google login needs VITE_GOOGLE_CLIENT_ID.
              </p>
            )}

            <div className="divider my-5 text-xs text-slate-400">or</div>

            <div className="text-center text-sm text-slate-500">
              {isLogin ? 'Need an account?' : 'Already registered?'}
              <button
                className="btn btn-link btn-sm px-2 text-slate-900"
                type="button"
                onClick={() => switchMode(isLogin ? 'register' : 'login')}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
