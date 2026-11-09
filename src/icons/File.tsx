import { type SVGProps } from 'react';

import { supportRef } from '@ds/common/support-ref';

export const File = supportRef(({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) => (
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 1.5C3.67157 1.5 3 2.17157 3 3V13C3 13.8284 3.67157 14.5 4.5 14.5H11.5C12.3284 14.5 13 13.8284 13 13V5.91421C13 5.649 12.8946 5.39464 12.7071 5.20711L9.29289 1.79289C9.10536 1.60536 8.851 1.5 8.58579 1.5H4.5ZM4 3C4 2.72386 4.22386 2.5 4.5 2.5H8V5.5C8 6.05228 8.44772 6.5 9 6.5H12V13C12 13.2761 11.7761 13.5 11.5 13.5H4.5C4.22386 13.5 4 13.2761 4 13V3ZM9 2.70711L11.7929 5.5H9V2.70711Z"
        />
    </svg>
));

File.displayName = 'File';
