const FormCancelBtn = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all"
        >
            Cancel
        </button>
    )
}

export default FormCancelBtn