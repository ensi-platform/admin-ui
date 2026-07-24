import { type ReactNode, type Ref } from 'react';

import { type CheckboxGroupProps as RacCheckboxGroupProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldComponent, type IFormFieldMessagesProps, type IFormFieldShellProps } from '@/form/types';

export type TCheckboxGroupSize = 'sm' | 'md' | 'lg';

/** Theme inputs (layout chrome only — no visual variant). */
export interface ICheckboxGroupThemeProps {
    /** Group chrome size (`data-size`). Set Checkbox `size` on each item explicitly. */
    size?: TCheckboxGroupSize;
}

/** Control state (our names, not RAC). */
export interface ICheckboxGroupControlProps {
    /** Controlled selected values. */
    value?: string[];
    /** Uncontrolled initial selected values. */
    defaultValue?: string[];
    /** Selection change handler. */
    onChange?: (value: string[]) => void;
}

/** Own props. */
export interface ICheckboxGroupOwnProps extends IDataTestIdProps {
    /** Checkboxes and arbitrary layout. */
    children: ReactNode;
    /** Ref to the group root (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

/** Content slice for FormCheckboxGroup. */
export interface ICheckboxGroupContentProps {
    children: ReactNode;
}

export interface ICheckboxGroupBaseProps
    extends ICheckboxGroupThemeProps, IFieldStateProps, ICheckboxGroupControlProps, ICheckboxGroupOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TCheckboxGroupRacOmit = 'isDisabled' | 'isInvalid';

export interface ICheckboxGroupProps
    extends
        ICheckboxGroupBaseProps,
        Omit<RacCheckboxGroupProps, keyof ICheckboxGroupBaseProps | TCheckboxGroupRacOmit> {}

export interface IFormCheckboxGroupProps
    extends IFormFieldComponent, IFormFieldShellProps, IFormFieldMessagesProps, ICheckboxGroupContentProps {}
