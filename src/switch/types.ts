import { type ReactNode, type Ref } from 'react';

import { type SwitchFieldProps as RacSwitchFieldProps } from 'react-aria-components';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldComponent, type IFormFieldMessagesProps, type IFormFieldShellProps } from '@/form/types';

export type TSwitchSize = 'sm' | 'md' | 'lg';

export type TSwitchVariant = 'primary';

/** Theme inputs. */
export interface ISwitchThemeProps {
    /** Switch size. */
    size?: TSwitchSize;
    /** Visual variant. */
    variant?: TSwitchVariant;
}

/** Control state (our names, not RAC). */
export interface ISwitchControlProps {
    /** Controlled checked state. */
    checked?: boolean;
    /** Uncontrolled initial checked state. */
    defaultChecked?: boolean;
    /** Checked change handler. */
    onChange?: (checked: boolean) => void;
}

/** Own / chrome props (not from RAC Field). */
export interface ISwitchOwnProps extends IDataTestIdProps {
    /** Visible label. Without children, provide `aria-label` / `aria-labelledby`. */
    children?: ReactNode;
    /** Ref to the label element (React 19 prop). */
    ref?: Ref<HTMLLabelElement>;
}

/** Content slice for FormSwitch. */
export interface ISwitchContentProps {
    children?: ReactNode;
}

export interface ISwitchBaseProps extends ISwitchThemeProps, IFieldStateProps, ISwitchControlProps, ISwitchOwnProps {}

/** RAC keys omitted because names differ from ours. */
export type TSwitchRacOmit = 'isSelected' | 'defaultSelected' | 'isDisabled' | 'isInvalid';

export interface ISwitchProps
    extends ISwitchBaseProps, Omit<RacSwitchFieldProps, keyof ISwitchBaseProps | TSwitchRacOmit> {}

export interface IFormSwitchProps
    extends
        IFormFieldComponent,
        IFormFieldShellProps,
        Pick<IFormFieldMessagesProps, 'hint'>,
        Pick<ISwitchThemeProps, 'variant'>,
        ISwitchContentProps {}
