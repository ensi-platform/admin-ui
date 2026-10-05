import { type ComponentPropsWithRef, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface ICopyButtonOwnProps extends IDataTestIdProps {
    /** Text shown and written to the clipboard. */
    children: string;
    /** How long the success icon stays, in milliseconds. */
    timeout?: number;
    /** Ref to the button (React 19 prop). */
    ref?: Ref<HTMLButtonElement>;
}

export interface ICopyButtonProps
    extends Omit<ComponentPropsWithRef<'button'>, keyof ICopyButtonOwnProps | 'children'>, ICopyButtonOwnProps {}
