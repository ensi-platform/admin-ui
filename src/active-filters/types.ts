import { type ComponentPropsWithRef, type ReactNode, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

/** Own / chrome props (not from DOM). */
export interface IActiveFiltersOwnProps extends IDataTestIdProps {
    /** Chips. An empty row is not rendered. */
    children?: ReactNode;
    /** Clears every chip. Omitted — no clear link. */
    onClear?: () => void;
    /** Ref to the row (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
}

export interface IActiveFiltersProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof IActiveFiltersOwnProps | 'children'>, IActiveFiltersOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IActiveFiltersItemOwnProps extends IDataTestIdProps {
    /** Chip text, for example `Category: meat`. */
    children: ReactNode;
    /** Shows a remove control. */
    onRemove?: () => void;
    /** Disables the chip and its remove control. */
    disabled?: boolean;
    /** Ref to the chip (React 19 prop). */
    ref?: Ref<HTMLSpanElement>;
}

export interface IActiveFiltersItemProps
    extends
        Omit<ComponentPropsWithRef<'span'>, keyof IActiveFiltersItemOwnProps | 'children'>,
        IActiveFiltersItemOwnProps {}

/** Own / chrome props (not from DOM). */
export interface IActiveFiltersGroupOwnProps extends IDataTestIdProps {
    /** Field name shown before the count. */
    label: string;
    /** Selected value count. */
    count: number;
    /** Same list the column filter renders. */
    children: ReactNode;
    /** `auto` scrolls the drop. `virtual` leaves scrolling to the list inside. */
    scroll?: 'auto' | 'virtual';
    /** Removes the whole group. Shows a clear control. */
    onRemove?: () => void;
    /** Ref to the chip button (React 19 prop). */
    ref?: Ref<HTMLButtonElement>;
}

export interface IActiveFiltersGroupProps
    extends
        Omit<ComponentPropsWithRef<'button'>, keyof IActiveFiltersGroupOwnProps | 'children'>,
        IActiveFiltersGroupOwnProps {}
