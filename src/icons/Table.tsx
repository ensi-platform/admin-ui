import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Table = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2.5 3.5h11v9h-11v-9zm1.2 1.2v2h2.6v-2H3.7zm3.8 0v2h2.6v-2H7.5zm3.8 0v2h1.8v-2h-1.8zM3.7 8v2.3h2.6V8H3.7zm3.8 0v2.3h2.6V8H7.5zm3.8 0v2.3h1.8V8h-1.8z"
        />
    </svg>
));

Table.displayName = 'Table';
