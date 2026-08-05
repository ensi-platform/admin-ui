import { type ElementType, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps, type TMergeElementProps } from '@ds/common';
import { type typographyStyles } from '@ds/typography';

/** Own / chrome props (not from DOM). */
export interface ILinkOwnProps extends IDataTestIdProps {
    /** Content. */
    children: ReactNode;
    /** Typography role from `@ds/typography`. Defaults to `bodyS`. */
    typography?: keyof typeof typographyStyles;
    /** Ref to the link root (React 19 prop). */
    ref?: Ref<HTMLElement>;
}

export interface ILinkBaseProps extends ILinkOwnProps {}

export type TLinkProps<P extends ElementType = 'a'> = {
    /** Polymorphic root element or component. Defaults to `a`. */
    as?: P;
} & TMergeElementProps<P, ILinkBaseProps>;
