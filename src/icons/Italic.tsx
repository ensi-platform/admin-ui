import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Italic = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path fill="currentColor" d="M9.8 2.5h3.7v1.6h-1.4l-2.6 7.8h1.5v1.6H7.2v-1.6h1.3l2.6-7.8H9.8V2.5z" />
    </svg>
));

Italic.displayName = 'Italic';
