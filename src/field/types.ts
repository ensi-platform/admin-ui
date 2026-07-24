import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

export type TFieldSize = 'sm' | 'md' | 'lg';

/** Shared field / control state. */
export interface IFieldStateProps {
    /** Invalid state. */
    invalid?: boolean;
    /** Disabled state. */
    disabled?: boolean;
    /** Stretch to 100% of the parent width. */
    block?: boolean;
}

/** Props spread onto the control via `useField().controlProps`. */
export interface IFieldControlProps {
    id: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    disabled?: boolean;
}

/** Field context value from `useField()`. */
export interface IFieldContextValue {
    id: string;
    labelId: string;
    hintId: string;
    errorId: string;
    invalid: boolean;
    disabled?: boolean;
    size: TFieldSize;
    controlProps: IFieldControlProps;
}

/** Theme inputs (layout chrome, no visual variant). */
export interface IFieldThemeProps {
    /** Label / spacing size. */
    size?: TFieldSize;
}

/** Own props. */
export interface IFieldOwnProps extends IDataTestIdProps {
    /** Label / Hint / Error slots and a control wired with `useField().controlProps`. */
    children: ReactNode;
}

export interface IFieldBaseProps extends IFieldThemeProps, IFieldStateProps, IFieldOwnProps {}

export interface IFieldProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFieldBaseProps | 'children'>, IFieldBaseProps {}

export type { IFieldLabelProps } from './components/Label/types';
export type { IFieldHintProps } from './components/Hint/types';
export type { IFieldErrorProps } from './components/Error/types';
