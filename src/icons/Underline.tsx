import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Underline = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M3 13.5h10v1.2H3zM4.2 2.5h1.6v6.2c0 1.4.8 2.2 2.2 2.2s2.2-.8 2.2-2.2V2.5h1.6v6.2c0 2.3-1.4 3.6-3.8 3.6S4.2 11 4.2 8.7V2.5z"
        />
    </svg>
));

Underline.displayName = 'Underline';
