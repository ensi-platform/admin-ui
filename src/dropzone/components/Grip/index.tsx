import { Button as RacButton } from 'react-aria-components';

import { GripVertical } from '@/icons';

/** Drag handle. Shown only when reorder is on. */
export const Grip = ({
    label,
    className,
    iconClassName,
}: {
    label: string;
    className: string;
    iconClassName: string;
}) => (
    <RacButton slot="drag" className={className} aria-label={label} data-dropzone-grip="">
        <GripVertical className={iconClassName} />
    </RacButton>
);
