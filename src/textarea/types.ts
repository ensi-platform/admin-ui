import { type Ref } from 'react';

import { type TextAreaProps as RacTextAreaProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TTextAreaSize = 'sm' | 'md' | 'lg';

export type TTextAreaVariant = 'primary';

/** Theme inputs. */
export interface ITextAreaThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TTextAreaSize;
    /** Visual variant. */
    variant?: TTextAreaVariant;
}

/** Own / chrome props (not from RAC). */
export interface ITextAreaOwnProps extends IDataTestIdProps {
    /** Clear button for the current value. */
    clear?: boolean;
    /** Visible and copyable, but not editable. Not `disabled`. */
    readOnly?: boolean;
    /** Ref to the native textarea (React 19 prop). */
    ref?: Ref<HTMLTextAreaElement>;
}

export interface ITextAreaBaseProps extends ITextAreaThemeProps, IFieldStateProps, ITextAreaOwnProps {}

export type TTextAreaRacOmit = 'disabled' | 'readOnly' | 'isDisabled' | 'isInvalid' | 'isReadOnly';

export interface ITextAreaProps
    extends ITextAreaBaseProps, Omit<RacTextAreaProps, keyof ITextAreaBaseProps | TTextAreaRacOmit> {}

/** className belongs on the Field shell. */
export type TTextAreaFormRacOmit =
    | TTextAreaRacOmit
    | keyof ITextAreaBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'className';

export interface ITextAreaContentProps extends Omit<RacTextAreaProps, TTextAreaFormRacOmit> {
    clear?: boolean;
    /** Visible and copyable, but not editable. Not `disabled`. */
    readOnly?: boolean;
}

export interface IFormTextAreaProps
    extends IFormFieldLayoutProps, Pick<ITextAreaThemeProps, 'variant'>, ITextAreaContentProps {}
