import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  required,
  formData,
  setFormData,
  icon: Icon, // Icon component pass kora jabe
  placeholder,
  ...rest
}) => {
  return (
    <div className="group">
      <label className="block text-xs font-bold text-base-content/60 uppercase tracking-wider mb-2 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          required={required}
          name={name}
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-12" : "pl-6"
          } pr-6 py-4 rounded-2xl bg-base-200 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all text-base-content font-medium placeholder:text-base-content/30`}
          {...rest}
        />
      </div>
    </div>
  );
};

export default FormInput;
