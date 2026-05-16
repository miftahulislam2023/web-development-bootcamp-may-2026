import { useEffect, useState } from "react";

import api from "../services/api";

export default function Dashboard() {

  const [transactions, setTransactions] =
    useState([]);

  const [formData, setFormData] =
    useState({

      type: "expense",
      amount: "",
      category: "",
      note: "",
    });

  const token =
    localStorage.getItem("token");

  const fetchTransactions =
    async () => {

      try {

        const res = await api.get(
          "/transactions/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setTransactions(res.data);

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchTransactions();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/transactions/add",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setFormData({
          type: "expense",
          amount: "",
          category: "",
          note: "",
        });

        fetchTransactions();

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold">

          Dashboard

        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 border border-white/10 rounded-3xl p-8 mt-10 grid md:grid-cols-2 gap-5"
        >

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="bg-[#0B1736] p-4 rounded-xl outline-none"
          >

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expense
            </option>

          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="bg-[#0B1736] p-4 rounded-xl outline-none"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="bg-[#0B1736] p-4 rounded-xl outline-none"
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="bg-[#0B1736] p-4 rounded-xl outline-none"
          />

          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-semibold md:col-span-2"
          >

            Add Transaction

          </button>

        </form>

        <div className="mt-12">

          <h2 className="text-3xl font-bold">

            Recent Transactions

          </h2>

          <div className="mt-6 space-y-5">

            {transactions.map((item) => (

              <div
                key={item._id}
                className="bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center justify-between"
              >

                <div>

                  <h3 className="text-xl font-semibold">

                    {item.category}

                  </h3>

                  <p className="text-gray-400">

                    {item.note}

                  </p>

                </div>

                <div
                  className={
                    item.type === "income"
                      ? "text-green-400 text-2xl font-bold"
                      : "text-red-400 text-2xl font-bold"
                  }
                >

                  {item.type === "income"
                    ? "+"
                    : "-"}

                  ৳ {item.amount}

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}