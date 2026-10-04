import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'elevated'
  | 'text'
  | 'primary'
  | 'secondary'
  | 'danger';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  filled: [
    'bg-primary-600 text-white',
    'hover:bg-primary-700 hover:shadow-md hover:shadow-primary-900/20',
    'active:bg-primary-800',
    'focus-visible:bg-primary-700',
  ].join(' '),

  tonal: [
    'bg-support-700 text-support-100',
    'hover:bg-support-600',
    'active:bg-support-500',
    'focus-visible:bg-support-600',
  ].join(' '),

  outlined: [
    'bg-transparent text-primary-400 border border-border-main',
    'hover:bg-primary-600/8',
    'active:bg-primary-600/12',
    'focus-visible:bg-primary-600/8 focus-visible:border-primary-400',
  ].join(' '),

  elevated: [
    'bg-dark-800 text-primary-400 shadow-sm shadow-dark-900/40',
    'hover:bg-dark-700 hover:shadow-md hover:shadow-dark-900/30',
    'active:bg-dark-600',
    'focus-visible:bg-dark-700',
  ].join(' '),

  text: [
    'bg-transparent text-primary-400',
    'hover:bg-primary-600/8',
    'active:bg-primary-600/12',
    'focus-visible:bg-primary-600/8',
  ].join(' '),

  // Legacy aliases
  primary: [
    'bg-primary-600 text-white',
    'hover:bg-primary-700 hover:shadow-md hover:shadow-primary-900/20',
    'active:bg-primary-800',
    'focus-visible:bg-primary-700',
  ].join(' '),

  secondary: [
    'bg-support-700 text-support-100',
    'hover:bg-support-600',
    'active:bg-support-500',
    'focus-visible:bg-support-600',
  ].join(' '),

  danger: [
    'bg-danger-600 text-white',
    'hover:bg-danger-700 hover:shadow-md hover:shadow-danger-900/20',
    'active:bg-danger-800',
    'focus-visible:bg-danger-700',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-8 px-3 text-xs gap-1.5',
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-10 px-6 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-base gap-2.5',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: '[&_svg]:size-4',
  sm: '[&_svg]:size-4',
  md: '[&_svg]:size-[18px]',
  lg: '[&_svg]:size-5',
  xl: '[&_svg]:size-5',
};

export default function Button({
  variant = 'filled',
  size = 'md',
  icon,
  trailingIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center',
          'rounded-md font-medium select-none',
          'transition-[background-color,box-shadow,opacity] duration-200',
          '[transition-timing-function:cubic-bezier(0.2,0,0,1)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400',
          'disabled:opacity-38 disabled:pointer-events-none disabled:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          iconSizeStyles[size],
          className,
        ),
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
      {trailingIcon}
    </button>
  );
}
