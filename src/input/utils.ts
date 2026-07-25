import { type ChangeEvent } from 'react';

/** Synthetic change event used by clear control. */
export const toEmptyInputChangeEvent = (el: HTMLInputElement | null): ChangeEvent<HTMLInputElement> =>
    ({
        target: el ?? { value: '' },
        currentTarget: el ?? { value: '' },
    }) as ChangeEvent<HTMLInputElement>;

/** Sets native input value via the prototype setter when the node exists. */
export const clearInputElementValue = (el: HTMLInputElement | null) => {
    if (!el) {
        return;
    }

    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    setter?.call(el, '');
};
