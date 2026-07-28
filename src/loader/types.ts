import { type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Loader size. */
export type TLoaderSize = 'sm' | 'md' | 'lg';

/** Theme inputs. */
export interface ILoaderThemeProps {
    /** Spinner size. */
    size?: TLoaderSize;
}

/** Own / chrome props (not from DOM). */
export interface ILoaderOwnProps extends IDataTestIdProps {
    /** When true, show veil + spinner over children. */
    active?: boolean;
    /** Content under the overlay. */
    children?: ReactNode;
    /** Ref to the root shell (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface ILoaderBaseProps extends ILoaderThemeProps, ILoaderOwnProps {}

export interface ILoaderProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ILoaderBaseProps | 'children'>, ILoaderBaseProps {}
