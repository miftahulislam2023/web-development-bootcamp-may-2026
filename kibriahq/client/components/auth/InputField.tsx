import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
    label: string;
    id: string;
    type?: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
}

const InputField = ({ label, id, type = "text", placeholder, register, error }: Props) => {
    return (
        <div className="space-y-2">
            <label className="ml-1 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register}
                className="h-14 w-full rounded-xl border-0 bg-surface-container-lowest px-5 font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all duration-200 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-primary"
            />
            {error && (
                <span className="text-sm text-red-400">
                    {error.message}
                </span>
            )}
        </div>
    )
}

export default InputField