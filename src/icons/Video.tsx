import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Video = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden={title ? undefined : true}
        {...props}
    >
        {title ? <title>{title}</title> : null}
        <path fill="currentColor" d="M2.5 4h8v8h-8V4zm8.2 2.2 3 1.6v.4l-3 1.6V6.2z" />
    </svg>
));

Video.displayName = 'Video';
