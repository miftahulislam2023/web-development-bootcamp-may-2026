import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddWallet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const options = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
    { value: "upay", label: "Upay" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleAddWallet = (data) => {
    const walletData = {
      ...data,
      type: data.type.value,
    };

    console.log(walletData);

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
          .post("/wallet", walletData)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                title: "Added!",
                text: "Your wallet has been added.",
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
        Add Your Wallet
      </h1>

      <form onSubmit={handleSubmit(handleAddWallet)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>

          <input
            type="text"
            placeholder="eg: Cash Wallet/ Bank Account/ Mobile Banking"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
            {...register("title", {
              required: "Title is required",
            })}
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Balance */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Current Balance
          </label>

          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
            {...register("balance", {
              required: "Balance is required",
            })}
          />

          {errors.balance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.balance.message}
            </p>
          )}
        </div>

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

        {/* Account Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            A/C Number
          </label>

          <input
            type="text"
            placeholder="Enter account number"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
            {...register("accountNumber", {
              required: "Account number is required",
            })}
          />

          {errors.accountNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-secondary hover:bg-primary transition text-white py-3 rounded-xl font-semibold text-lg cursor-pointer"
        >
          Add Wallet
        </button>
      </form>
    </div>
  );
};

export default AddWallet;
