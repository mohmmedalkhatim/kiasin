import React, { ReactElement } from "react";

interface LoadingCircleProps {
    size?: number;       // diameter of circle
    strokeWidth?: number; // thickness of circle
    progress?: number;   // external progress control (0 - 100)
    animate?: boolean;
    children?: ReactElement[] | ReactElement | String  // auto animate if true
}

export const GoalCircle: React.FC<LoadingCircleProps> = ({
    size = 200,
    strokeWidth = 12,
    progress = 5,
    children
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (
        <div className="flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="gray"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="opacity-30"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all stroke-sky-600 duration-200"
                />
            </svg>
            <div className="absolute flex flex-col gap-5 items-center justify-center text-sm">
                {children}
            </div>
        </div>
    );
};

export default GoalCircle;
