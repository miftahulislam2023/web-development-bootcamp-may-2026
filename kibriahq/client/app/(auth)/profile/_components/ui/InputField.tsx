import { UseFormRegisterReturn, FieldError } from "react-hook-form"

type Props = {
    id: string;
    label: string;
    icon: React.ReactNode;
    register: UseFormRegisterReturn;
    error: FieldError;
    isEditing: boolean;
    placeholder?: string;
    type?: string;
}

const InputField = ({ id, label, icon, register, error, isEditing, placeholder, type = "text" }: Props) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon}
                <input
                    id={id}
                    type={type}
                    {...register}
                    disabled={!isEditing}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:text-slate-500"
                />
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    )
}

export default InputField