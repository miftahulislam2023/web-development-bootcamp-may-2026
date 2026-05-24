import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Film,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Calendar,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useRole from "../../hooks/useRole";
 import { LazyLoadImage } from "react-lazy-load-image-component";

const DashboardHome = () => {
  const { user } = useAuth();
  const {role , isLoading: roleLoading} = useRole();
  const axiosSecure = useAxiosSecure();

  // TODO: Replace with real role check from DB if available
  const isAdmin = role?.role === "admin";

  const [stats, setStats] = useState({
    totalMovies: 0,
    watchlistCount: 0,
    avgRating: 0,
    totalRuntime: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  // --- Fetch Data Logic (Only for Admin to save resources) ---
  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Admin fetches everything, User fetches only basic stats if needed
        const movieRes = await axiosSecure.get(
          `/movies/my-collection?addedBy=${user?.email}`
        );
        const movies = movieRes.data;

        const watchRes = await axiosSecure.get(
          `/watchlist?email=${user?.email}`
        );

        // Calculate Stats
        const totalMovies = movies.length;
        const totalRating = movies.reduce(
          (acc, curr) => acc + parseFloat(curr.rating || 0),
          0
        );
        const avgRating =
          totalMovies > 0 ? (totalRating / totalMovies).toFixed(1) : 0;
        const totalRuntime = movies.reduce(
          (acc, curr) => acc + parseInt(curr.runtime || 0),
          0
        );

        setStats({
          totalMovies,
          watchlistCount: watchRes.data.length,
          avgRating,
          totalRuntime,
        });

        if (isAdmin) {
          // Chart Data
          const genreCounts = {};
          movies.forEach((movie) => {
            const genre = movie.genre || "Unknown";
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });

          const formattedChartData = Object.keys(genreCounts).map((key) => ({
            name: key,
            count: genreCounts[key],
          }));
          setChartData(formattedChartData);

          // Recent Movies Table
          const recent = [...movies].reverse().slice(0, 5);
          setRecentMovies(recent);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosSecure, user, isAdmin]);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* --- 1. Welcome Banner (For Both) --- */}
      <div className="relative rounded-[2.5rem] bg-linear-to-r from-primary to-red-900 p-8 md:p-10 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black">
                Hello, {user?.displayName?.split(" ")[0]}! 👋
              </h1>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <p className="text-white/80 max-w-lg">
              {isAdmin
                ? "Here is the comprehensive overview of the platform performance."
                : "Welcome back to your personal movie space. Ready to watch something new?"}
            </p>
          </div>
          {isAdmin && (
            <Link
              to="/dashboard/add-movie"
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Film size={18} /> Add New
            </Link>
          )}
        </div>
      </div>

      {/* ==================== USER VIEW ==================== */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Action Card 1 */}
          <div className="p-8 rounded-4xl bg-base-100 border border-base-content/5 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-2">My Watchlist</h3>
            <p className="text-base-content/60 mb-6">
              You have {stats.watchlistCount} movies saved for later.
            </p>
            <Link
              to="/dashboard/watchlist"
              className="font-bold text-blue-500 flex items-center gap-2 hover:gap-3 transition-all"
            >
              View Watchlist <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Action Card 2 */}
          <div className="p-8 rounded-4xl bg-base-100 border border-base-content/5 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <Film size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-2">All Movies</h3>
            {/* <p className="text-base-content/60 mb-6">
              Manage your {stats.totalMovies} contributed movies.
            </p> */}
            <Link
              to="/all-movies"
              className="font-bold text-green-500 flex items-center gap-2 hover:gap-3 transition-all"
            >
              Go to All Movies <ArrowRight size={16} />
            </Link>
          </div>

          {/* Profile Summary */}
          <div className="md:col-span-2 p-8 rounded-4xl bg-base-200/50 border border-base-content/5 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center text-base-content/40">
              <User size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">Profile Status</h4>
              <p className="text-base-content/60">
                Your account is active and in good standing.
              </p>
            </div>
            <Link
              to="/dashboard/profile"
              className="ml-auto px-6 py-3 rounded-xl bg-base-100 text-base-content font-bold shadow-sm hover:bg-white transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* ==================== ADMIN VIEW (Dynamic Data) ==================== */}
      {isAdmin && (
        <>
          {/* --- 2. Stats Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Movies"
              value={stats.totalMovies}
              icon={Film}
              color="bg-blue-500"
            />
            <StatCard
              title="Watchlist"
              value={stats.watchlistCount}
              icon={Heart}
              color="bg-red-500"
            />
            <StatCard
              title="Avg Rating"
              value={stats.avgRating}
              icon={Star}
              color="bg-yellow-500"
            />
            <StatCard
              title="Mins Watched"
              value={stats.totalRuntime}
              icon={Clock}
              color="bg-green-500"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* --- 3. Dynamic Chart --- */}
            <div className="p-6 md:p-8 rounded-[2.5rem] bg-base-100 border border-base-content/5 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Genre Insights
              </h3>
              <div className="h-75 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          borderRadius: "10px",
                          border: "none",
                          color: "#fff",
                        }}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % 20]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-base-content/40">
                    No data available for charts
                  </div>
                )}
              </div>
            </div>

            {/* --- 4. Dynamic Table --- */}
            <div className="p-6 md:p-8 rounded-[2.5rem] bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-primary" /> Recent Adds
                </h3>
                <Link
                  to="/dashboard/my-movies"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-base-content/40 uppercase border-b border-base-content/5">
                      <th className="pb-3 pl-2">Movie</th>
                      <th className="pb-3">Genre</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentMovies.length > 0 ? (
                      recentMovies.map((movie) => (
                        <tr
                          key={movie._id}
                          className="group hover:bg-base-200/50 transition-colors border-b border-base-content/5 last:border-0"
                        >
                          <td className="py-3 pl-2 flex items-center gap-3">
                            <LazyLoadImage
                              src={movie.poster}
                              alt={movie.title}
                              className="w-8 h-8 rounded-lg object-cover bg-base-300"
                              effect="blur"
                            />
                            <span className="font-bold text-base-content truncate max-w-30">
                              {movie.title}
                            </span>
                          </td>
                          <td className="py-3 text-base-content/70">
                            {movie.genre}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-600 font-bold text-xs">
                              {movie.rating}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            <Link
                              to={`/movie-details/${movie._id}`}
                              className="p-2 rounded-lg hover:bg-base-300 inline-block text-base-content/60"
                            >
                              <ArrowRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 text-center text-base-content/40"
                        >
                          No movies added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sub-component for Stats (Admin Only)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="p-6 rounded-4xl bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`p-3 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} />
      </div>
    </div>
    <h3 className="text-3xl font-black text-base-content">{value}</h3>
    <p className="text-sm font-medium text-base-content/60">{title}</p>
  </div>
);

export default DashboardHome;
