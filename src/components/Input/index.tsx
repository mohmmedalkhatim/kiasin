import { useState } from "react";

type InputProps = {
  label?: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
};

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
}: InputProps) {
  const [touched, setTouched] = useState(false);

  return (
    <div className={`flex flex-col gap-1 rounded-lg ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`border-[1px] border-[#e2e2e220] rounded-md p-2 outline-none bg-transparent text-white  focus:ring-blue-100 transition-all ${
          error && touched ? "border-red-500" : ""
        }`}
      />
      {error && touched && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
