import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const Redo = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M12 6.5H6.8c-1.8 0-3.3 1.4-3.3 3.2s1.5 3.2 3.3 3.2H9v-1.4H6.8c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8H12l-2.2 2.2 1 1 3.4-3.4-3.4-3.4-1 1L12 6.5z"
        />
    </svg>
));

Redo.displayName = 'Redo';
