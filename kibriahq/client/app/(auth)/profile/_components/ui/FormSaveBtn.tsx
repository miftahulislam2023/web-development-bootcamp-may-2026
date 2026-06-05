import { Loader2, Save } from 'lucide-react'

const FormSaveBtn = ({ isSaving }: { isSaving: boolean }) => {
    return (
        <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-slate-600 to-slate-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
        >
            {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Save size={18} className="hidden sm:inline" />
            )}
            Save <span className="hidden sm:inline">Changes</span>
        </button>
    )
}

export default FormSaveBtn