import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Code = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M6.2 5.2 2.8 8l3.4 2.8-.9 1.1L1 8l4.3-3.9.9 1.1zm3.6 0 .9-1.1L15 8l-4.3 3.9-.9-1.1L13.2 8 9.8 5.2zM8.7 3.2l1.1-.2.8 9.6-1.1.2-.8-9.6z"
        />
    </svg>
));

Code.displayName = 'Code';
