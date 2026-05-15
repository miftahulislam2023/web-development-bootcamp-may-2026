export function DropdownItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-base-content/80 rounded-2xl hover:bg-base-100/80 dark:hover:bg-base-300/50 hover:text-primary hover:shadow-sm transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-base-200/50 dark:bg-base-300/30 group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-base-content/50 group-hover:text-primary transition-colors" />
        </div>
        {label}
      </div>
      {/* {isNew && (
        <span className="px-2 py-0.5 text-[0.6rem] font-black uppercase bg-primary/10 text-primary rounded-full">
          New
        </span>
      )} */}
    </button>
  );
}
