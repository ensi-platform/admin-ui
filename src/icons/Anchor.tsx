import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Anchor = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M8 1.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM7.2 5.2h1.6V7h2.4v1.4H8.8v.3c1.7.3 3 1.2 3.4 2.5H11c-.3-.8-1.2-1.4-2.2-1.6v3.6c0 .5-.4.8-.8.8s-.8-.3-.8-.8V9.6c-1 .2-1.9.8-2.2 1.6H3.8c.4-1.3 1.7-2.2 3.4-2.5v-.3H4.8V7h2.4V5.2z"
        />
    </svg>
));

Anchor.displayName = 'Anchor';
