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
  icon?:ReactElement
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

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className='flex group'>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`border-[1px] border-r-0 grow border-[#e2e2e220] rounded-l-xs  text-sm focus-within:ring-[#e2e2e250] focus-within:ring p-2 outline-none bg-transparent text-white transition-all ${error && touched ? 'border-red-500' : ''
            }`}
        />
        <div className={`border-[1px] border-l-0 border-[#e2e2e220] rounded-r-xs text-sm focus-within:ring-[#e2e2e250] focus-within:ring p-2 pt-[10px] outline-none bg-transparent text-white  focus:ring-blue-100 transition-all ${error && touched ? 'border-red-500' : ''
          }`}>
            {icon}
          </div>
      </div>
      {error && touched && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
    </div>
  );
}
