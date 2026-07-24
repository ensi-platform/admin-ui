import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type IDataTestIdProps } from '@ds/common';

export type TTagSize = 'sm' | 'md';

export type TTagVariant = 'primary';

/** Theme inputs. */
export interface ITagThemeProps {
    /** Tag size. */
    size?: TTagSize;
    /** Visual variant. */
    variant?: TTagVariant;
}

/** Own / chrome props (not from DOM). */
export interface ITagOwnProps extends IDataTestIdProps {
    /** Content. */
    children: ReactNode;
    /** Show a remove control and call this handler on remove. */
    onRemove?: () => void;
    /** Disabled state (includes the remove button). */
    disabled?: boolean;
}

export interface ITagBaseProps extends ITagThemeProps, ITagOwnProps {}

export interface ITagProps
    extends ITagBaseProps, Omit<ComponentPropsWithRef<'span'>, keyof ITagBaseProps | 'children' | 'disabled'> {}
