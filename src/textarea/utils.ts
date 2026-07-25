import { type ChangeEvent } from 'react';

/** Synthetic change event used by clear control. */
export const toEmptyTextAreaChangeEvent = (el: HTMLTextAreaElement | null): ChangeEvent<HTMLTextAreaElement> =>
    ({
        target: el ?? { value: '' },
        currentTarget: el ?? { value: '' },
    }) as ChangeEvent<HTMLTextAreaElement>;

/** Sets native textarea value via the prototype setter when the node exists. */
export const clearTextAreaElementValue = (el: HTMLTextAreaElement | null) => {
    if (!el) {
        return;
    }

    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter?.call(el, '');
};
