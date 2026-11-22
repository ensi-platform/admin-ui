import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Maximize = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M3 3h4v1.4H4.4V7H3V3zm6 0h4v4h-1.4V4.4H9V3zM4.4 9v2.6H7V13H3V9h1.4zM12 9v4H9v-1.4h2.6V9H12z"
        />
    </svg>
));

Maximize.displayName = 'Maximize';
