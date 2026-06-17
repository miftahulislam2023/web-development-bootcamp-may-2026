import React, { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { NavLink } from "react-router";
import Swal from "sweetalert2";
import useTransactionData from "../../hooks/useTransactionData";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { GiCancel } from "react-icons/gi";

const Transactions = () => {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");
  const { transactionData, refetch } = useTransactionData({ searchText, filterType });
  const axiosSecure = useAxiosSecure();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const deleteTransaction = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/transactions/${id}`);

      if (res.data.deletedCount > 0) {
        await Swal.fire({
          title: "Deleted!",
          text: "Transaction has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold">Your Transactions</h1>

        <NavLink to="/dashboard/add-transaction">
          <button className="bg-secondary hover:bg-primary px-5 py-3 rounded-xl text-white cursor-pointer hover:opacity-90 transition">
            Add Transaction
          </button>
        </NavLink>
      </div>

      <div className="flex flex-col md:flex-row gap-3 my-4 p-2">
        <input
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded p-2"
          type="text"
          placeholder="Search transaction..."
        />

        <select
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-gray-200 rounded-3xl shadow-lg">
        <table className="w-full text-left">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactionData.map((transaction) => (
              <tr
                key={transaction._id}
                className="border-b border-gray-300 hover:bg-gray-300"
              >
                <td className="p-4 font-medium">{transaction.title}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-medium ${
                      transaction.type === "income"
                        ? "bg-green-200 text-green-700"
                        : transaction.type === "expense"
                          ? "bg-red-200 text-red-700"
                          : transaction.type === "investment"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-purple-200 text-purple-700"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td className="p-4">{transaction.category}</td>

                <td className="p-4 font-semibold">$ {transaction.amount}</td>

                <td className="p-4">{transaction.date}</td>

                <td className="flex text-xl gap-6 p-4">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="cursor-pointer"
                  >
                    <IoEyeSharp />
                  </button>
                  <NavLink
                    to={`/dashboard/edit-transaction/${transaction._id}`}
                    className="cursor-pointer"
                  >
                    <FaEdit />
                  </NavLink>
                  <button
                    onClick={() => deleteTransaction(transaction._id)}
                    className="cursor-pointer"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="md:hidden space-y-4">
        {transactionData.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-gray-200 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{transaction.title}</h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.type === "income"
                    ? "bg-green-200 text-green-700"
                    : transaction.type === "expense"
                      ? "bg-red-200 text-red-700"
                      : transaction.type === "investment"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-purple-200 text-purple-700"
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="space-y-2 text-sm flex justify-between">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Category: </span>
                  {transaction.category}
                </p>

                <p>
                  <span className="font-semibold">Amount: </span>
                  {transaction.amount}
                </p>

                <p>
                  <span className="font-semibold">Date: </span>
                  {transaction.date}
                </p>
              </div>

              <div className="flex flex-col text-xl gap-2 mr-5">
                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  className="cursor-pointer"
                >
                  <IoEyeSharp />
                </button>
                <NavLink
                  to={`/dashboard/edit-transaction/${transaction._id}`}
                  className="cursor-pointer"
                >
                  <FaEdit />
                </NavLink>
                <button
                  onClick={() => deleteTransaction(transaction._id)}
                  className="cursor-pointer"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-4 right-4 text-3xl cursor-pointer"
            >
              <GiCancel />
            </button>

            <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>

            <div className="flex justify-between space-y-3 px-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-semibold">{selectedTransaction.title}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">
                    $ {selectedTransaction.amount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{selectedTransaction.date}</p>
                </div>
              </div>

              {/* Type Category */}
              <div className="space-y-3">
                {/* Type */}
                <div>
                  <p className="text-sm text-gray-500">Type</p>

                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-medium inline-block mt-1 ${
                      selectedTransaction.type === "income"
                        ? "bg-green-200 text-green-700"
                        : selectedTransaction.type === "expense"
                          ? "bg-red-200 text-red-700"
                          : selectedTransaction.type === "investment"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-purple-200 text-purple-700"
                    }`}
                  >
                    {selectedTransaction.type}
                  </span>
                </div>

                {/* Category */}
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">
                    {selectedTransaction.category}
                  </p>
                </div>
                {/* Category */}
                <div>
                  <p className="text-sm text-gray-500">Wallet</p>
                  <p className="font-semibold">
                    {selectedTransaction.walletType}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Note</p>

              <div className="bg-gray-100 rounded-xl p-4 mt-1">
                {selectedTransaction.note || "No note available"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
