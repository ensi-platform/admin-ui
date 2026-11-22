import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const AlignRight = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path fill="currentColor" d="M2 3h12v1.5H2V3zm4 4h8v1.5H6V7zm-4 4h12v1.5H2V11z" />
    </svg>
));

AlignRight.displayName = 'AlignRight';
