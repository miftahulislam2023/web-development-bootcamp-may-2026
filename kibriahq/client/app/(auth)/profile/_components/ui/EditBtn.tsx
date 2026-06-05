import { User } from 'lucide-react'

const EditBtn = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-900/90 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm cursor-pointer"
        >
            <User size={18} className="hidden sm:inline" />
            Edit Profile
        </button>
    )
}

export default EditBtn