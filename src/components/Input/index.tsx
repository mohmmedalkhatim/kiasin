import { ReactElement, useState } from 'react';

type InputProps = {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  icon?: ReactElement;
};

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
  className = '',
}: InputProps) {
  const [touched, setTouched] = useState(false);
  const hasError = error && touched;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`group flex items-center border rounded-sm  transition-all
          ${hasError ? 'border-red-500' : 'border-[#e2e2e240]'} 
          focus-within:ring focus-within:ring-[#e2e2e250]`}
      >
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => setTouched(true)}
          className="grow outline-none border-none text-xs rounded-l-sm text-sm bg-transparent text-white "
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
