const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-300 to-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100/80 backdrop-blur-lg border border-base-300 shadow-2xl rounded-3xl p-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;