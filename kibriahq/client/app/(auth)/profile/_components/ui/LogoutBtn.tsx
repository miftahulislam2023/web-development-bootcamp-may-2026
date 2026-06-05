import { LogOut } from 'lucide-react';

const LogoutBtn = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 border border-slate-400 hover:border-slate-600 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm cursor-pointer"
        >
            <LogOut size={18} className="hidden sm:inline" />
            Logout
        </button>
    )
}

export default LogoutBtn