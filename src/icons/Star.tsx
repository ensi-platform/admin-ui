import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Star = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path
            d="M8 1.4 9.59 5.82l4.69.14-3.71 2.87 1.31 4.51L8 10.7l-3.88 2.64 1.31-4.51L1.72 5.96l4.69-.14L8 1.4Z"
            fill="currentColor"
        />
    </svg>
));

Star.displayName = 'Star';
