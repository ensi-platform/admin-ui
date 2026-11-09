import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';

import { useIMask } from 'react-imask';

import { supportRef } from '@ds/common/support-ref';

import { Input } from '@/input';

import { type IMaskProps } from './types';

const toChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
    ({
        target: { value },
        currentTarget: { value },
    }) as ChangeEvent<HTMLInputElement>;

/** Only the clear control emits a change event without `nativeEvent`; IMask reports typed input via `onAccept`. */
const isSyntheticClear = (event: ChangeEvent<HTMLInputElement>) =>
    !event.nativeEvent && event.currentTarget.value === '';

const toMaskString = (value: IMaskProps['value']) => (value == null ? '' : String(value));

export const Mask = supportRef(({ opts, value: valueProp, defaultValue, onChange, ref, ...rest }: IMaskProps) => {
    const onChangeRef = useRef(onChange);
    const inputRef = useRef<HTMLInputElement | null>(null);
    /** Accepts caused by writing `value` into the mask must not emit. */
    const isSyncing = useRef(false);
    /** Last normalized string already sent for the current raw `value`. */
    const reportedFor = useRef<string | null>(null);
    const isControlled = valueProp !== undefined;

    onChangeRef.current = onChange;

    const onAccept = useCallback((val: string) => {
        if (isSyncing.current) return;

        onChangeRef.current?.(toChangeEvent(val));
    }, []);

    const { maskRef } = useIMask<HTMLInputElement>(opts, {
        ref: inputRef,
        onAccept,
    });

    useEffect(() => {
        if (!isControlled) return;

        const mask = maskRef.current;

        if (!mask) return;

        const next = toMaskString(valueProp);

        if (mask.value === next) {
            reportedFor.current = null;
            return;
        }

        isSyncing.current = true;
        mask.value = next;
        const normalized = String(mask.value);
        isSyncing.current = false;

        if (normalized === next || reportedFor.current === normalized) return;

        reportedFor.current = normalized;
        onChangeRef.current?.(toChangeEvent(normalized));
    });

    return (
        <Input
            {...rest}
            ref={node => {
                inputRef.current = node;

                if (typeof ref === 'function') {
                    ref(node);
                    return;
                }

                if (ref) ref.current = node;
            }}
            {...(isControlled ? { value: toMaskString(valueProp) } : { defaultValue })}
            onChange={event => {
                if (!isSyntheticClear(event)) return;

                const mask = maskRef.current;

                if (mask && mask.value !== '') {
                    isSyncing.current = true;
                    mask.value = '';
                    isSyncing.current = false;
                }

                onChangeRef.current?.(toChangeEvent(''));
            }}
        />
    );
});

Mask.displayName = 'Mask';
