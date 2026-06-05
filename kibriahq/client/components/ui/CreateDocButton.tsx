import { Plus } from 'lucide-react'

const CreateDocButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="group w-full sm:w-fit flex items-center gap-3 bg-white text-indigo-600 px-5 py-3 rounded-2xl border border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
            <div className="p-2 bg-indigo-600/20 rounded-xl">
                <Plus size={24} />
            </div>
            <span className="text-lg font-semibold">Create New</span>
        </button>
    )
}

export default CreateDocButton