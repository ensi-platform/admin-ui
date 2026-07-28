import { type SVGProps } from 'react';

export const Calendar = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M5.25 1.25a.75.75 0 0 1 .75.75V3h4V2a.75.75 0 0 1 1.5 0V3h.75A1.75 1.75 0 0 1 14 4.75v8.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-8.5A1.75 1.75 0 0 1 3.75 3H4.5V2a.75.75 0 0 1 .75-.75ZM3.5 6.5v6.75c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V6.5h-9Z"
            fill="currentColor"
        />
    </svg>
);

Calendar.displayName = 'Calendar';
