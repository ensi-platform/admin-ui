import { type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface IFiltersOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the section (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersOwnProps | 'children'>, IFiltersOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IFiltersBodyOwnProps extends IDataTestIdProps {
    children: ReactNode;
    /** Ref to the body (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersBodyProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersBodyOwnProps | 'children'>, IFiltersBodyOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IFiltersFooterOwnProps extends IDataTestIdProps {
    children?: ReactNode;
    /** Ref to the footer (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IFiltersFooterProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IFiltersFooterOwnProps | 'children'>, IFiltersFooterOwnProps {}
