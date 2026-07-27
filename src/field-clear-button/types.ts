import { type TComboboxSize, type TComboboxVariant } from '@/combobox/types';

export type TFieldClearSize = TComboboxSize;
export type TFieldClearVariant = TComboboxVariant;

/** Presentational clear control props. */
export interface IFieldClearButtonProps {
    isDisabled: boolean;
    size: TFieldClearSize;
    variant: TFieldClearVariant;
    onClear: () => void;
}
