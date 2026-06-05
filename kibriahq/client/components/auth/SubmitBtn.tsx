const SubmitBtn = ({ label }: { label: string }) => {
    return (
        <button
            className="primary-gradient flex h-14 w-full items-center justify-center gap-2 rounded-xl font-bold text-on-primary shadow-[0_8px_20px_rgba(62,50,211,0.2)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            type="submit"
        >
            {label}
        </button>
    )
}

export default SubmitBtn