import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Strike = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2.5 8h11v1.3h-11zM5 3.5h6c1.3 0 2 .6 2 1.5h-1.5c0-.3-.3-.5-.7-.5H5.8v1.2H8v1.2H4.6V4.8C4.6 3.9 5.4 3.5 6.2 3.5H5zm1.2 7.2h3.6c.5 0 .8.2.8.6s-.3.6-.8.6H6.2c-.5 0-.8-.2-.8-.6s.3-.6.8-.6z"
        />
    </svg>
));

Strike.displayName = 'Strike';
