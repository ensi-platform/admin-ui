import { type SVGProps } from 'react';

export const Check = ({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M12.78 4.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L6.75 9.44l4.97-4.97a.75.75 0 0 1 1.06 0Z"
            fill="currentColor"
        />
    </svg>
);

Check.displayName = 'Check';
