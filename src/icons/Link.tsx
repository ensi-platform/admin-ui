import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Link = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M6.7 9.3a2.2 2.2 0 0 1 0-3.1l1.1-1.1a2.2 2.2 0 0 1 3.2.1l-.9.9a1 1 0 0 0-1.4 0L7.6 7.2a1 1 0 0 0 0 1.4l.9.9-1.8-.2zm2.6-2.6.9-.9 1.1 1.1a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4-.1l-.9.9a2.2 2.2 0 0 0 3.2.1l1.1-1.1a2.2 2.2 0 0 0 0-3.1L9.3 6.7l.0.0z"
        />
    </svg>
));

Link.displayName = 'Link';
