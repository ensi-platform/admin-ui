export type TComboboxSize = 'sm' | 'md' | 'lg';

export type TComboboxVariant = 'primary';

export type TComboboxValue = string | number;

export interface IComboboxOption {
    /** Option value (RAC Key). */
    value: TComboboxValue;
    /** Label shown in the list and in the trigger. */
    label: string;
    /** Disabled option. */
    disabled?: boolean;
}
