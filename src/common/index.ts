import { type ComponentPropsWithRef, type ElementType, type FC, type SVGProps } from 'react';

export type TSVGRIcon = FC<
    SVGProps<SVGSVGElement> & {
        title?: string;
    }
>;

export type TMergeElementProps<T extends ElementType, P extends object> = Omit<ComponentPropsWithRef<T>, keyof P> & P;
