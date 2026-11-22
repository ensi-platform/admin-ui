import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Quote = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M3 4h4v3c0 2-1 3.2-2.6 4l-.6-1.2C4.6 9.2 5 8.4 5 7.5H3V4zm6 0h4v3c0 2-1 3.2-2.6 4l-.6-1.2c.8-.6 1.2-1.4 1.2-2.3H9V4z"
        />
    </svg>
));

Quote.displayName = 'Quote';
