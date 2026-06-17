import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useWalletData from "../../hooks/useWalletData";
import { useNavigate } from "react-router";

const AddTransaction = () => {
  const axiosSecure = useAxiosSecure();
  const { walletData } = useWalletData();
  const navigate = useNavigate();

  if (!walletData.length) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Add a wallet first!",
    });
    navigate('/dashboard/wallet')
  }

  const options = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
    { value: "investment", label: "Investment" },
    { value: "savings", label: "Savings" },
  ];

  const wallets = walletData.map((wallet) => ({
    value: wallet._id,
    label: wallet.type,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleAddTransaction = (data) => {
    const { wallet, type, ...rest } = data;
    const transactionData = {
      ...rest,
      type: type.value,
      walletId: wallet.value,
      walletType: wallet.label,
    };

    console.log(transactionData);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed)
        axiosSecure
          .post("/transactions", transactionData)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                title: "Added!",
                text: "Your transaction has been added.",
                icon: "success",
              });
              reset();
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: error.response.data.message,
            });
          });
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-200 rounded-xl p-6 md:p-10 shadow-xl">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">
        Add Your Transaction
      </h1>

      <form onSubmit={handleSubmit(handleAddTransaction)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>

            <input
              type="text"
              placeholder="eg: Salary / House Rent / Emergency Saving"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              {...register("title", {
                required: "Title is required",
              })}
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Select Wallet */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Wallet
            </label>

            <Controller
              name="wallet"
              control={control}
              rules={{
                required: "Wallet is required",
              }}
              render={({ field }) => (
                <Select
                  className="p-1 border border-gray-300 rounded-xl"
                  {...field}
                  options={wallets}
                  placeholder="Select Wallet"
                />
              )}
            />

            {errors.wallet && (
              <p className="text-red-500 text-sm mt-1">
                {errors.wallet.message}
              </p>
            )}
          </div>
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Amount
            </label>

            <input
              type="number"
              placeholder="eg: 5000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              {...register("amount", {
                required: "Amount is required",
              })}
            />

            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>

            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              {...register("date", {
                required: "Date is required",
              })}
            />

            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Type + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Type</label>

            <Controller
              name="type"
              control={control}
              rules={{
                required: "Type is required",
              }}
              render={({ field }) => (
                <Select
                  className="p-1 border border-gray-300 rounded-xl"
                  {...field}
                  options={options}
                  placeholder="Select Type"
                />
              )}
            />

            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>

            <input
              type="text"
              placeholder="eg: product sold / personal cost / grocery / medical cost"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              {...register("category", {
                required: "Category is required",
              })}
            />

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Note</label>

          <textarea
            rows="4"
            placeholder="Write a short note..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
            {...register("note")}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-500 transition text-white py-3 rounded-xl font-semibold text-lg cursor-pointer"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
