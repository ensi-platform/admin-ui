import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Undo = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M4 6.5h5.2c1.8 0 3.3 1.4 3.3 3.2S11 12.9 9.2 12.9H7v-1.4h2.2c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H4l2.2 2.2-1 1L1.8 6.8 5.2 3.4l1 1L4 6.5z"
        />
    </svg>
));

Undo.displayName = 'Undo';
