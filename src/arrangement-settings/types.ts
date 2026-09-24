import { type IDataTestIdProps } from '@ds/common';

import { type TDrawerPlacement } from '@/drawer';

/** Item the settings drawer can show, hide, and reorder. */
export interface IArrangementSettingsItem {
    id: string;
    /** Label shown in the list. */
    label: string;
}

/** Own / chrome props (not from DOM). */
export interface IArrangementSettingsProps extends IDataTestIdProps {
    /** Controlled open state. */
    open: boolean;
    /** Open state change. Cancel and dismiss pass `false` without saving. */
    onOpenChange?: (open: boolean) => void;
    /** Drawer title. */
    title: string;
    /** Physical side of the viewport. */
    placement?: TDrawerPlacement;
    /** Every item, including hidden ones. */
    items: readonly IArrangementSettingsItem[];
    /** Visible item ids, in order. */
    value: readonly string[];
    /** Commits the draft and the drawer closes. */
    onSave: (value: string[]) => void;
}
