import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const ListOrdered = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2.2 3.6h1.5V2H2.4v.5H2V3.2h.2v.4zm.1 2.2H2v.8c.5.3.9.6.9 1.1 0 .5-.4.8-.9.8-.4 0-.7-.2-.9-.5l.7-.5c.1.1.2.2.3.2.2 0 .3-.1.3-.2 0-.2-.2-.3-.6-.6H2v.7h1.6V7.4H2.3zm.2 4.3c-.4 0-.7.2-.8.4l.7.4c.1-.1.2-.1.3-.1.2 0 .4.1.4.3s-.2.3-.5.3h-.4v.7h.5c.5 0 1.1-.2 1.1-.9 0-.6-.5-1.1-1.3-1.1zM6 3h8v1.5H6V3zm0 5h8v1.5H6V8zm0 5h8v1.5H6V13z"
        />
    </svg>
));

ListOrdered.displayName = 'ListOrdered';
