export default function StatCard({ title, value, sub, icon, color, trend }) {
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-900 animate-slide-up">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${color} transition-all duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest letter-spacing">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 truncate">
          {value}
        </p>
        {sub && (
          <p
            className={`text-xs mt-2 flex items-center gap-1.5 font-medium ${
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trend === "down"
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {trend === "up" ? (
              <span className="inline-block animate-bounce-light">📈</span>
            ) : trend === "down" ? (
              <span className="inline-block animate-bounce-light">📉</span>
            ) : null}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
