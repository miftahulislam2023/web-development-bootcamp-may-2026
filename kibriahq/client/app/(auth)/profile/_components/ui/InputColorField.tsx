import { Palette } from 'lucide-react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type Props = {
    register: UseFormRegisterReturn;
    isEditing: boolean;
    error: FieldError;
}


const InputColorField = ({ register, isEditing, error }: Props) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
                Color
            </label>
            <div className="relative">
                <Palette size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                    {...register}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:text-slate-500"
                >
                    <option value="amber">Amber</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="orange">Orange</option>
                    <option value="yellow">Yellow</option>
                    <option value="cyan">Cyan</option>
                    <option value="indigo">Indigo</option>
                    <option value="violet">Violet</option>
                    <option value="fuchsia">Fuchsia</option>
                    <option value="rose">Rose</option>
                    <option value="lime">Lime</option>
                    <option value="emerald">Emerald</option>
                    <option value="teal">Teal</option>
                    <option value="sky">Sky</option>
                    <option value="slate">Slate</option>
                    <option value="gray">Gray</option>
                    <option value="zinc">Zinc</option>
                    <option value="neutral">Neutral</option>
                    <option value="stone">Stone</option>
                </select>
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    )
}

export default InputColorField