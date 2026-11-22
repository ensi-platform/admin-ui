import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Smile = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zM5.6 6.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zm4.8 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zM8 10.8c1.3 0 2.2-.7 2.6-1.4l1 .6c-.6 1.1-1.9 2-3.6 2s-3-.9-3.6-2l1-.6c.4.7 1.3 1.4 2.6 1.4z"
        />
    </svg>
));

Smile.displayName = 'Smile';
