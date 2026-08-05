import { type SVGProps } from 'react';

export const PanelLeft = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 1.75A1.25 1.25 0 0 0 1.25 3v10c0 .69.56 1.25 1.25 1.25h11c.69 0 1.25-.56 1.25-1.25V3c0-.69-.56-1.25-1.25-1.25h-11ZM2.5 3h11v10h-11V3Z"
        />
        <path fill="currentColor" d="M6 3h1.25v10H6V3Z" />
    </svg>
);

PanelLeft.displayName = 'PanelLeft';
