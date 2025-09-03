import { useEffect, useRef } from "react";

const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  onClick,
  onKeyDown,
  tabIndex,
  autoFocus = false,
  onEnterPress,
  nextInputRef,
  inputRef,
}) => {
  const internalRef = useRef(null);
  const ref = inputRef || internalRef;

  // Auto focus nếu được yêu cầu
  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus, ref]);

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-white ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  const handleKeyDown = (e) => {
    // Gọi onKeyDown custom nếu có
    if (onKeyDown) {
      onKeyDown(e);
    }

    // Xử lý Enter key
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn submit form mặc định

      // Gọi onEnterPress callback nếu có
      if (onEnterPress) {
        onEnterPress(e);
      }

      // Tự động chuyển sang input tiếp theo
      if (nextInputRef && nextInputRef.current) {
        setTimeout(() => {
          nextInputRef.current.focus();
          nextInputRef.current.select(); // Select all text để dễ nhập mới
        }, 10);
      } else if (tabIndex) {
        // Nếu không có nextInputRef, tìm input tiếp theo theo tabIndex
        const currentTabIndex = parseInt(tabIndex) || 0;
        const nextInput = document.querySelector(`input[tabindex="${currentTabIndex + 1}"]`);
        if (nextInput) {
          setTimeout(() => {
            nextInput.focus();
            nextInput.select();
          }, 10);
        }
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        onClick={onClick}
        tabIndex={tabIndex}
      />

      {hint && (
        <p className={`mt-1.5 text-xs ${error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;