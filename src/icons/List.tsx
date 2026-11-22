import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const List = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            d="M2.25 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM6 3h8v1.5H6V3zm0 5h8v1.5H6V8zm0 5h8v1.5H6V13z"
        />
    </svg>
));

List.displayName = 'List';
