import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Indent = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2 3h12v1.3H2zm4 3.2h8v1.3H6zM2 9.4h12v1.3H2zM6 12.6h8v1.3H6zM2 6.2l2.4 1.6L2 9.4V6.2z"
        />
    </svg>
));

Indent.displayName = 'Indent';
