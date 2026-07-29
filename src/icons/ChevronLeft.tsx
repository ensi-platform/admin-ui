import { type SVGProps } from 'react';

export const ChevronLeft = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M10.03 4.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06L7.56 8l2.47-2.47a.75.75 0 0 0 0-1.06Z"
            fill="currentColor"
        />
    </svg>
);

ChevronLeft.displayName = 'ChevronLeft';
