import { type SVGProps } from 'react';

export const ChevronRight = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M5.97 4.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L8.44 8 5.97 5.53a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
        />
    </svg>
);

ChevronRight.displayName = 'ChevronRight';
