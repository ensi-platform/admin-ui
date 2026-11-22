import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Outdent = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2 3h12v1.3H2zm0 3.2h8v1.3H2zM2 9.4h12v1.3H2zM2 12.6h8v1.3H2zM14 6.2v3.2L11.6 7.8 14 6.2z"
        />
    </svg>
));

Outdent.displayName = 'Outdent';
