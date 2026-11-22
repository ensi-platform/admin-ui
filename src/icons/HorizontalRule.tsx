import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const HorizontalRule = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path fill="currentColor" d="M2 7.4h12v1.2H2z" />
    </svg>
));

HorizontalRule.displayName = 'HorizontalRule';
