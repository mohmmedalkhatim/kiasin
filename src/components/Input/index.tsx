import React, { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactElement, useState } from 'react';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  required?: boolean;
  className?: string;
  icon?: ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  placeholder,
  value,
  error,
  required = false,
  icon,
  className = '',
  ...props
}: InputProps) {
  const [touched, setTouched] = useState(false);
  const hasError = error && touched;

  return (
    <div className={`flex flex-col gap-1 p-1 ${className}`} {...props}>
      {label && (
        <label className="text-xs font-medium text-white ">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`group flex items-center border rounded-sm  transition-all
          ${hasError ? 'border-red-500' : 'border-[#e2e2e220]'} 
          focus-within:ring focus-within:ring-[#e2e2e250]`}
      >
        <input
          {...props}
          value={value}
          placeholder={placeholder}
          onBlur={() => setTouched(true)}
          className="grow outline-none border-none text-xs rounded-l-sm bg-transparent text-white "
        />
        <div
          className={`rounded-r-sm pb-1 pt-[4px] pr-2 text-white transition-colors
            ${hasError ? 'text-red-500' : 'group-focus-within:text-white'}`}
        >
          {icon}
        </div>
      </div>

      {hasError && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
