import { type SVGProps } from 'react';

/** Sort ascending: short bar on top, long bar at the bottom. */
export const SortAscending = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <rect x="40" y="48" width="64" height="24" rx="8" fill="currentColor" />
        <rect x="40" y="116" width="120" height="24" rx="8" fill="currentColor" />
        <rect x="40" y="184" width="176" height="24" rx="8" fill="currentColor" />
    </svg>
);

SortAscending.displayName = 'SortAscending';
