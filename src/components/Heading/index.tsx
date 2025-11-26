import React from "react"

type HeadingProps = {
    level: string
} & React.DetailsHTMLAttributes<HTMLHeadingElement>
let HeadingClasses = (level: number) => {
    switch (level) {
        case 1:
            return 'text-4xl font-bold';
        case 2:
            return 'text-3xl font-semibold';
        case 3:
            return 'text-2xl font-medium';
        case 4:
            return 'text-xl font-medium';
        case 5:
            return 'text-lg font-medium';
        case 6:
            return 'text-base';
        default:
            return 'text-2xl font-medium';
    }
}
function Heading({ level, style, ...props }: HeadingProps) {
    return React.
        createElement(`h${level}`,
            { className: HeadingClasses(Number(level)), ...props })
}
export default Heading