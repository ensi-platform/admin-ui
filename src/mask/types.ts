import { type FactoryOpts } from 'imask';

import { type IFormFieldLayoutProps } from '@/form/types';
import { type IInputContentProps, type IInputProps, type IInputThemeProps } from '@/input';

/** IMask options. The mask itself is supplied by the caller. */
export interface IMaskOwnProps {
    /**
     * IMask factory options (`mask`, `blocks`, `prepare`, …).
     * Keep the same object between renders (`useMemo` or a constant). A new object every render makes IMask refresh.
     */
    opts: FactoryOpts;
}

/** `value` and `onChange` always carry the masked string (not the unmasked or typed value). */
export interface IMaskProps extends IInputProps, IMaskOwnProps {}

/** Content slice for FormMask. */
export interface IMaskContentProps extends IInputContentProps, IMaskOwnProps {}

export interface IFormMaskProps extends IFormFieldLayoutProps, Pick<IInputThemeProps, 'variant'>, IMaskContentProps {}
