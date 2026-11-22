import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Bold = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M4 2.5h5.1c1.7 0 2.9.9 2.9 2.3 0 .9-.5 1.6-1.3 1.9 1 .3 1.6 1.2 1.6 2.2 0 1.5-1.3 2.6-3.2 2.6H4v-9zm1.8 3.4h2.7c.7 0 1.1-.3 1.1-.8s-.4-.8-1.1-.8H5.8v1.6zm0 1.6v1.8h3.1c.8 0 1.2-.4 1.2-.9s-.4-.9-1.2-.9H5.8z"
        />
    </svg>
));

Bold.displayName = 'Bold';
