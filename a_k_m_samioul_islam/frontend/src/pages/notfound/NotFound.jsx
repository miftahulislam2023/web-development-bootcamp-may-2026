import React from "react";
import Card from "../../components/notFoundCard/Card";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">
      <Card></Card>
      <button
        onClick={handleGoBack}
        className="btn h-12 w-full max-w-xs border border-white bg-black text-lg font-medium text-white transition-colors duration-500 hover:border-black hover:bg-white hover:text-black"
      >
        Go back
      </button>
    </div>
  );
};

export default NotFound;
