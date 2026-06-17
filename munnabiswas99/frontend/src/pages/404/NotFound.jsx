import React from "react";
import { useLottie } from "lottie-react";
import notfound from "../../assets/lottiesFiles/Error 404.json";
const NotFound = () => {
  const options = {
    animationData: notfound,
    loop: true,
  };

  const { View } = useLottie(options);
  return <div className="md:w-1/3 mx-auto p-5">{View}</div>;
};

export default NotFound;
