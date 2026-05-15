import React from "react";
import { ChevronDown } from "lucide-react";

const FormSelect = ({
  label,
  name,
  required,
  options,
  formData,
  setFormData,
  icon: Icon,
}) => {
  return (
    <div className="group">
      <label className="block text-xs font-bold text-base-content/60 uppercase tracking-wider mb-2 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <select
          required={required}
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className={`w-full ${
            Icon ? "pl-12" : "pl-6"
          } pr-10 py-4 rounded-2xl bg-base-200 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all text-base-content font-medium appearance-none cursor-pointer`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
