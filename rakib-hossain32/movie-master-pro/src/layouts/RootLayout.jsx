import React from "react";

import { Outlet, useNavigation } from "react-router";
// import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation/Navigation";

import { ToastContainer } from "react-toastify";
import { Atom } from "react-loading-indicators";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const RootLayout = () => {


  const loading = useNavigation();
  // console.log(loading.state);

  return (
    <div className={`flex flex-col min-h-screen`}>
      {/* <Header /> */}
      <Navigation />
      {loading.state === "loading" ? (
        <LoadingSpinner />
      ) : (
        <div className="flex-1 ">
          <Outlet />
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default RootLayout;
