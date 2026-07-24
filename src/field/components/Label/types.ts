import { type HTMLAttributes, type ReactNode } from 'react';

export interface IFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}
