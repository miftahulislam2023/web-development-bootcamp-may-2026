import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

const options = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "investment", label: "Investment" },
  { value: "savings", label: "Savings" },
];

const EditTransaction = () => {
  const { id } = useParams();
  console.log(id);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: transactionData = {}, refetch } = useQuery({
    queryKey: ["transaction"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/transactions/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (transactionData?._id) {
      reset({
        title: transactionData.title,
        amount: transactionData.amount,
        date: transactionData.date,
        category: transactionData.category,
        note: transactionData.note,
        type: options.find((option) => option.value === transactionData.type),
      });
    }
  }, [transactionData, reset]);

  const handleUpdateTransaction = (data) => {
    const modifiedTransactionData = {
      ...data,
      type: data.type.value,
    };

    console.log(modifiedTransactionData);

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
          .patch(`/transactions/${id}`, modifiedTransactionData)
          .then((res) => {
            if (res.data.modifiedCount) {
              Swal.fire({
                title: "Updated!",
                text: "Your transaction has been Updated.",
                icon: "success",
              });

              refetch();
              navigate("/dashboard/transactions");
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
        Edit Your Transaction
      </h1>

      <form
        onSubmit={handleSubmit(handleUpdateTransaction)}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>

          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
            {...register("title", {
              required: "Title is required",
            })}
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
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
              placeholder="Enter amount"
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
              placeholder="Enter category"
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
          className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg cursor-pointer"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;
