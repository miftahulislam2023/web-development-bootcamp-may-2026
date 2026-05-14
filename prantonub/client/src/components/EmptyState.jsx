export default function EmptyState({ icon = null, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <p className="text-5xl mb-4 text-gray-300 dark:text-gray-600">📋</p>
      <p className="font-bold text-gray-800 dark:text-gray-200 text-xl">
        {title}
      </p>
      {sub && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
          {sub}
        </p>
      )}
      {action && <div className="mt-6 animate-slide-up">{action}</div>}
    </div>
  );
}
