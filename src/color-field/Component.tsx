import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import { Button as RacButton, ColorSwatch, Dialog, DialogTrigger, Popover } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { ColorPicker } from '@/color-picker';
import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { colorFieldGroupVariants } from './theme';
import { type IColorFieldProps } from './types';
import { commitHexInput, describeColorValue } from './utils';

import styles from './styles.module.css';

export const ColorField = supportRef(
    ({
        ref,
        inputRef,
        size = 'md',
        variant = 'primary',
        block = true,
        invalid = false,
        disabled = false,
        clear = false,
        presets,
        value,
        defaultValue,
        onChange,
        onBlur,
        className,
        dataTestId,
        id,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...domProps
    }: IColorFieldProps) => {
        const { clear: clearLabel, openPalette, colorCode, colorPalette } = useAuiLabels();
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
        const current = isControlled ? value : uncontrolledValue;
        const display = describeColorValue(current);
        const [text, setText] = useState(display.text);
        const [previewHex, setPreviewHex] = useState<string | null>(null);
        const [hue, setHue] = useState<number | undefined>(undefined);
        /** Forces a resync after blur when the parent rejected the change and `current` did not move. */
        const [settledTick, setSettledTick] = useState(0);
        const groupRef = useRef<HTMLDivElement>(null);
        const setGroupRef = useCallback(
            (node: HTMLDivElement | null) => {
                groupRef.current = node;

                if (typeof ref === 'function') {
                    ref(node);

                    return;
                }

                if (ref) ref.current = node;
            },
            [ref]
        );
        const focusedRef = useRef(false);
        const dirtyRef = useRef(false);
        const lastEmittedRef = useRef(current);
        const markedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true' || display.unrecognized;
        const swatchColor = previewHex ?? display.hex;
        const showClear = clear && !disabled && (text !== '' || Boolean(display.hex));

        useEffect(() => {
            lastEmittedRef.current = current;
        }, [current, settledTick]);

        useEffect(() => {
            if (focusedRef.current) return;

            const next = describeColorValue(current);

            setText(next.text);
            setPreviewHex(null);
        }, [current, settledTick]);

        const emit = (hex: string, typed?: string) => {
            dirtyRef.current = false;
            setPreviewHex(hex || null);
            setText(typed !== undefined && typed.toLowerCase() === hex ? typed : hex);

            if (lastEmittedRef.current === hex) return;

            lastEmittedRef.current = hex;

            if (!isControlled) setUncontrolledValue(hex);

            if (hex === current) return;

            onChange?.(hex);
        };

        const settle = (raw: string) => {
            if (!dirtyRef.current && raw === display.text) return;

            const committed = commitHexInput(raw, 'settle');

            dirtyRef.current = false;

            if (committed == null) {
                setText(display.text);
                setPreviewHex(display.hex);

                return;
            }

            emit(committed);
        };

        const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;

            dirtyRef.current = true;
            setText(next);
            setPreviewHex(null);

            const committed = commitHexInput(next, 'live');

            if (committed) emit(committed, next);
        };

        const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;

            event.preventDefault();
            event.stopPropagation();
            settle(event.currentTarget.value);
        };

        return (
            <div {...domProps} className={cn(styles.root, block && styles.block, className)}>
                <div
                    ref={setGroupRef}
                    className={colorFieldGroupVariants({ size, variant, block })}
                    data-invalid={markedInvalid || undefined}
                    data-disabled={disabled || undefined}
                    data-test-id={dataTestId}
                >
                    <DialogTrigger
                        onOpenChange={open => {
                            if (!open) onBlur?.();
                        }}
                    >
                        <RacButton
                            className={styles.swatch}
                            aria-label={openPalette}
                            isDisabled={disabled}
                            data-empty={swatchColor ? undefined : true}
                            data-test-id="color-field-trigger"
                        >
                            {swatchColor ? <ColorSwatch className={styles.swatchColor} color={swatchColor} /> : null}
                        </RacButton>
                        <Popover className={styles.popover} placement="bottom start" triggerRef={groupRef}>
                            <Dialog
                                className={styles.dialog}
                                aria-label={colorPalette}
                                data-test-id="color-field-dialog"
                            >
                                <ColorPicker
                                    value={display.hex ?? ''}
                                    hue={hue}
                                    presets={presets}
                                    disabled={disabled}
                                    onHueChange={setHue}
                                    onPreview={hex => {
                                        setPreviewHex(hex);
                                        setText(hex);
                                    }}
                                    onChange={emit}
                                />
                            </Dialog>
                        </Popover>
                    </DialogTrigger>
                    <input
                        ref={inputRef}
                        id={id}
                        className={styles.hex}
                        aria-label={ariaLabelledby ? undefined : (ariaLabel ?? colorCode)}
                        aria-labelledby={ariaLabelledby}
                        aria-describedby={ariaDescribedby}
                        aria-invalid={markedInvalid || undefined}
                        placeholder="#RRGGBB"
                        spellCheck={false}
                        autoComplete="off"
                        disabled={disabled}
                        value={text}
                        data-test-id="color-field-input"
                        onFocus={() => {
                            focusedRef.current = true;
                        }}
                        onChange={onInputChange}
                        onBlur={event => {
                            focusedRef.current = false;
                            settle(event.target.value);
                            setSettledTick(tick => tick + 1);
                            onBlur?.();
                        }}
                        onKeyDown={onInputKeyDown}
                    />
                    {showClear ? (
                        <RacButton
                            className={styles.clear}
                            aria-label={clearLabel}
                            data-test-id="color-field-clear"
                            excludeFromTabOrder
                            onPress={() => emit('')}
                        >
                            <Clear className={styles.icon} />
                        </RacButton>
                    ) : null}
                </div>
            </div>
        );
    }
);

ColorField.displayName = 'ColorField';
