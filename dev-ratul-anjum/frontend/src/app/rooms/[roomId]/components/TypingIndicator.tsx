const TypingIndicator = () => {
  return (
    <div className="ml-4 mb-2 relative inline-flex w-fit items-center justify-start rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex items-center gap-1.5">
        {/* Dot 1 */}
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
          style={{ animationDelay: "0ms", animationDuration: "1s" }}
        />
        {/* Dot 2 */}
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
          style={{ animationDelay: "150ms", animationDuration: "1s" }}
        />
        {/* Dot 3 */}
        <div
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
          style={{ animationDelay: "300ms", animationDuration: "1s" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
