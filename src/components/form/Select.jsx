import { useState } from "react";

const Select = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select
      className={`w-full appearance-none rounded-lg border border-gray-300 bg-transparent pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
    >
      <option value="" disabled className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
