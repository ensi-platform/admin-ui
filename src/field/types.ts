import { type ComponentPropsWithRef, type HTMLAttributes, type ReactNode } from 'react';

export type TFieldSize = 'sm' | 'md' | 'lg';

export interface IFieldControlProps {
    id: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    disabled?: boolean;
}

export interface IFieldContextValue {
    id: string;
    labelId: string;
    hintId: string;
    errorId: string;
    isInvalid: boolean;
    disabled?: boolean;
    size: TFieldSize;
    controlProps: IFieldControlProps;
}

export interface IFieldProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
    /** Содержимое: Label / Hint / Error и контрол с `useField().controlProps`. */
    children: ReactNode;
    /** Невалидное состояние поля. */
    isInvalid?: boolean;
    /** Disabled для controlProps. */
    disabled?: boolean;
    /** Размер лейбла / отступов. */
    size?: TFieldSize;
    /** Значение атрибута `data-test-id`. */
    dataTestId?: string;
}

export interface IFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
    className?: string;
}

export interface IFieldHintProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    className?: string;
}

export interface IFieldErrorProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    className?: string;
}
