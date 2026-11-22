import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Superscript = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2 6.2h1.6l1.6 2.4 1.6-2.4H8.4L5.8 9.6 8.5 13H6.9L5.2 10.5 3.5 13H1.9l2.7-3.4L2 6.2zM9.2 2.4c.2-.6.8-1 1.6-1 .9 0 1.4.4 1.4 1s-.4.8-1.2 1l-.6.2c-1.3.4-2 .9-2 1.8 0 1.1.9 1.8 2.2 1.8 1.2 0 2-.5 2.3-1.3l-1.1-.4c-.1.3-.5.6-1.1.6-.6 0-1-.3-1-.7 0-.4.3-.6 1.1-.9l.7-.2c1.2-.4 1.8-1 1.8-1.9 0-1.2-1-2-2.4-2-1.3 0-2.2.6-2.5 1.6l1.2.4z"
        />
    </svg>
));

Superscript.displayName = 'Superscript';
