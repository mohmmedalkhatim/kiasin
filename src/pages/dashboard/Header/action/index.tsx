import { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../../../util';

type ButtonProps = {
    className?: string;
    description?:string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function HeaderAction({
    description,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        'font-medium transition-all duration-150 h-full focus-visible:ring-2 focus-visible:ring-primary-400 rounded-xs border-border-main focus:outline-none border hover:bg-dark-800 active:scale-[0.97]';
    return (
        <button
            className={classNames(
                baseStyles,
                "px-4 py-2.5 text-sm group relative",
                className
            )}
            title={description}
            {...props}
        >
            {children}
        </button>
    );
}
