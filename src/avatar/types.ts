import { type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Avatar size. */
export type TAvatarSize = 'sm' | 'md' | 'lg';

/** Visual variant. */
export type TAvatarVariant = 'primary';

/** Theme inputs. */
export interface IAvatarThemeProps {
    /** Avatar size. */
    size?: TAvatarSize;
    /** Visual variant. */
    variant?: TAvatarVariant;
}

/** Own / chrome props (not from DOM). */
export interface IAvatarOwnProps extends IDataTestIdProps {
    /** Image URL. When set, renders `<img>` inside. */
    src?: string;
    /** Accessible name / initials source. */
    name?: string;
    /** Explicit initials (overrides derived from `name`). */
    initials?: string;
    /** Custom content (icon, etc.). Takes precedence over `src` / initials. */
    children?: ReactNode;
    /** Ref to the avatar root (React 19 prop). */
    ref?: Ref<HTMLSpanElement>;
}

export interface IAvatarBaseProps extends IAvatarThemeProps, IAvatarOwnProps {}

export interface IAvatarProps
    extends IAvatarBaseProps, Omit<ComponentPropsWithRef<'span'>, keyof IAvatarBaseProps | 'children'> {}
