import React from "react";
import { RiBankCard2Fill } from "react-icons/ri";
import { NavLink } from "react-router";
import useWalletData from "../../hooks/useWalletData";
import { FaWallet } from "react-icons/fa6";

const Wallet = () => {
  const { walletData } = useWalletData();
  console.log(walletData);
  return (
    <div className="">
      <div className="flex justify-between items-center my-10 px-10">
        <h1 className="text-xl md:text-3xl font-bold">Your Wallets</h1>
        <NavLink
          to="/dashboard/add-wallet"
          className="text-white bg-secondary px-3 py-2 rounded-lg cursor-pointer hover:bg-primary"
        >
          Add Wallet
        </NavLink>
      </div>

      <div className="flex flex-col lg:flex-row flex-wrap justify-center md:justify-start md:ml-20 items-center w-full mx-auto gap-6">
        {walletData.map((wallet) => (
          <div key={wallet._id} className="shadow p-4 border border-gray-300 w-70 rounded-lg hover:bg-gray-300">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-xl">{wallet.title}</h1>
              <div className="text-4xl text-secondary">
                <FaWallet />
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-primary text-xl">{wallet.type}</p>
              <p><span className="font-bold">A/C:</span> {wallet.accountNumber}</p>
              <p>
                <span className="font-bold">Balance: ${wallet.balance}</span> 
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
