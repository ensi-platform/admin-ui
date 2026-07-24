import { type TSVGRIcon } from '@ds/common';

/** Icon props used by Button and similar chrome. */
export interface IIconButtonProps {
    /** SVG icon component (SVGR). */
    Component: TSVGRIcon;
    /** Place the icon after the text. */
    after?: boolean;
    /** Gap between the icon and the text. */
    indent?: number | string;
    /** Icon size. */
    size?: number | string;
    /** Extra className for the icon. */
    className?: string;
    /** Icon fill color. */
    fill?: string;
}
