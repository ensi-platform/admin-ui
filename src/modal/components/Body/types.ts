import { type HTMLAttributes, type ReactNode } from 'react';

export interface IModalBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
