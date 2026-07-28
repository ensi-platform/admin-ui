import { type SVGProps } from 'react';

export const MoreVertical = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M8 3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm0 3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm0 3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
            fill="currentColor"
        />
    </svg>
);

MoreVertical.displayName = 'MoreVertical';
