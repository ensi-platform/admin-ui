import { type IFormFieldLayoutProps } from '@/form/types';
import { type IInputContentProps, type IInputProps, type IInputThemeProps } from '@/input';

/** Password props. `type` is owned by the visibility toggle. */
export interface IPasswordProps extends Omit<IInputProps, 'type'> {}

/** Content slice for FormPassword. */
export interface IPasswordContentProps extends Omit<IInputContentProps, 'type'> {}

export interface IFormPasswordProps
    extends IFormFieldLayoutProps, Pick<IInputThemeProps, 'variant'>, IPasswordContentProps {}
