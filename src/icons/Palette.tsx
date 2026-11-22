import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Palette = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M8 2.2a5.8 5.8 0 0 0-5.2 8.3c.4.8 1.2 1.3 2.1 1.3H6.4c.5 0 .8.4.8.9 0 .9.7 1.6 1.6 1.6A4.2 4.2 0 0 0 13 10.2 5.8 5.8 0 0 0 8 2.2zM5.2 6.2a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm2.6-1.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm2.8.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zM11.6 8a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"
        />
    </svg>
));

Palette.displayName = 'Palette';
