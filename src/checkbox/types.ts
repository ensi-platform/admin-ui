import { type ReactNode, type Ref } from 'react';

import { type CheckboxFieldProps as RacCheckboxFieldProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldComponent, type IFormFieldMessagesProps, type IFormFieldShellProps } from '@/form/types';

export type TCheckboxSize = 'sm' | 'md' | 'lg';

export type TCheckboxVariant = 'primary';

/** Theme inputs. */
export interface ICheckboxThemeProps {
    /** Checkbox size. */
    size?: TCheckboxSize;
    /** Visual variant. */
    variant?: TCheckboxVariant;
}

/**
 * Control state (our names, not RAC).
 * Do not pass `checked` / `onChange` when used inside CheckboxGroup.
 */
export interface ICheckboxControlProps {
    /** Controlled checked state. */
    checked?: boolean;
    /** Uncontrolled initial checked state. */
    defaultChecked?: boolean;
    /** Checked change handler. */
    onChange?: (checked: boolean) => void;
    /** Indeterminate state (dash instead of checkmark). */
    indeterminate?: boolean;
}

/** Own / chrome props (not from RAC Field). */
export interface ICheckboxOwnProps extends IDataTestIdProps {
    /** Visible label. Without children, provide `aria-label` / `aria-labelledby`. */
    children?: ReactNode;
    /** Ref to the label element (React 19 prop). */
    ref?: Ref<HTMLLabelElement>;
}

/** Content slice for FormCheckbox. */
export interface ICheckboxContentProps {
    children?: ReactNode;
    indeterminate?: boolean;
}

export interface ICheckboxBaseProps
    extends ICheckboxThemeProps, IFieldStateProps, ICheckboxControlProps, ICheckboxOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TCheckboxRacOmit = 'isSelected' | 'defaultSelected' | 'isDisabled' | 'isInvalid' | 'isIndeterminate';

export interface ICheckboxProps
    extends ICheckboxBaseProps, Omit<RacCheckboxFieldProps, keyof ICheckboxBaseProps | TCheckboxRacOmit> {}

export interface IFormCheckboxProps
    extends
        IFormFieldComponent,
        IFormFieldShellProps,
        Pick<IFormFieldMessagesProps, 'hint'>,
        Pick<ICheckboxThemeProps, 'variant'>,
        ICheckboxContentProps {}
