function LogoutIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M15 17l5-5-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M20 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M11 21H5a2 2 0 01-2-2V5a2 2 0 012-2h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M10 12h10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 8l4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M4 4h8v16H4z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChatHeader({ conversation, status, user, onLeaveGroup, onLogout }) {
  const canLeaveGroup = conversation?.type === 'group';

  return (
    <header className="flex h-16 items-center border-b border-[#cbd5e1] bg-white px-5 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-semibold text-[#2563eb]">
          {conversation ? conversation.name.slice(0, 1).toUpperCase() : 'C'}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-[#111827]">
            {conversation ? conversation.name : 'Choose a chat'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <p className="text-xs text-[#64748b]">{status}</p>
          </div>
        </div>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-3 pl-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#334155] text-sm font-semibold leading-none text-white ring-1 ring-slate-200">
          {user.name.slice(0, 1).toUpperCase()}
        </div>

        <div className="hidden min-w-0 max-w-[220px] sm:block">
          <p className="truncate text-sm font-semibold leading-5 text-[#111827]">
            {user.name}
          </p>
          <p className="truncate text-xs leading-4 text-[#64748b]">
            {user.email}
          </p>
        </div>

        {canLeaveGroup && (
          <button
            className="btn btn-sm h-9 min-h-9 rounded-full border-red-200 bg-white px-3 text-red-600 hover:bg-red-50"
            title="Leave group"
            type="button"
            onClick={onLeaveGroup}
          >
            <LeaveIcon />
            <span className="hidden md:inline">Leave</span>
          </button>
        )}

        <button
          className="btn btn-sm h-9 min-h-9 rounded-full border-[#d7dde4] bg-white px-3 text-[#334155] hover:bg-[#edf1f5]"
          title="Logout"
          type="button"
          onClick={onLogout}
        >
          <LogoutIcon />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
