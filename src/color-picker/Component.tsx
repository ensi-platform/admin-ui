import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import {
    Button as RacButton,
    ColorArea,
    ColorPicker as RacColorPicker,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
    ColorSwatchPickerItem,
    ColorThumb,
    Dialog,
    DialogTrigger,
    Popover,
    SliderTrack,
    type Color,
} from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { colorPickerGroupVariants } from './theme';
import { type IColorPickerProps } from './types';
import { commitHexInput, describeColorValue, IDLE_DRAFT, toDraftColor, validPresetHexes } from './utils';

import styles from './styles.module.css';

const hexOf = (color: Color) => color.toString('hex').toLowerCase();

export const ColorPicker = supportRef(
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
    }: IColorPickerProps) => {
        const { clear: clearLabel, openPalette, colorCode, colorHue, colorPalette, colorPresets } = useAuiLabels();
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
        const current = isControlled ? value : uncontrolledValue;
        const display = describeColorValue(current);
        const [text, setText] = useState(display.text);
        const [draft, setDraft] = useState<Color>(() => toDraftColor(display.hex ?? IDLE_DRAFT));
        const [previewing, setPreviewing] = useState(false);
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
        const draggingRef = useRef(false);
        const lastEmittedRef = useRef(current);
        const presetHexes = validPresetHexes(presets);
        const markedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true' || display.unrecognized;
        const swatchColor = previewing ? draft : display.hex;
        const showClear = clear && !disabled && (text !== '' || Boolean(display.hex));

        useEffect(() => {
            lastEmittedRef.current = current;
        }, [current, settledTick]);

        // Keeps the HSB draft when it already matches `hex`, so hue survives gray colors.
        const syncDraft = (hex: string) => setDraft(prev => (hexOf(prev) === hex ? prev : toDraftColor(hex)));

        useEffect(() => {
            if (focusedRef.current || draggingRef.current) return;

            const next = describeColorValue(current);

            setText(next.text);
            syncDraft(next.hex ?? IDLE_DRAFT);
            setPreviewing(false);
        }, [current, settledTick]);

        const emit = (hex: string, typed?: string) => {
            dirtyRef.current = false;
            setPreviewing(Boolean(hex));
            setText(typed !== undefined && typed.toLowerCase() === hex ? typed : hex);
            syncDraft(hex || IDLE_DRAFT);

            if (lastEmittedRef.current === hex) return;

            lastEmittedRef.current = hex;

            if (!isControlled) setUncontrolledValue(hex);

            if (hex === current) return;

            onChange?.(hex);
        };

        const onPickerChange = (color: Color) => {
            const hex = hexOf(color);

            setDraft(color);
            setPreviewing(true);
            setText(hex);

            if (!draggingRef.current) emit(hex);
        };

        const finishGesture = (color: Color) => {
            draggingRef.current = false;
            emit(hexOf(color));
        };

        const releasePointerGesture = () => {
            draggingRef.current = false;
        };

        const startGesture = () => {
            draggingRef.current = true;
        };

        const settle = (raw: string) => {
            if (!dirtyRef.current && raw === display.text) return;

            const committed = commitHexInput(raw, 'settle');

            dirtyRef.current = false;

            if (committed == null) {
                setText(display.text);
                setDraft(toDraftColor(display.hex ?? IDLE_DRAFT));
                setPreviewing(Boolean(display.hex));

                return;
            }

            emit(committed);
        };

        const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;

            dirtyRef.current = true;
            setText(next);

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
            <RacColorPicker value={draft} onChange={onPickerChange}>
                <div className={cn(styles.root, block && styles.block, className)}>
                    <div
                        ref={setGroupRef}
                        className={colorPickerGroupVariants({ size, variant, block })}
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
                                data-test-id="color-picker-trigger"
                            >
                                {swatchColor ? (
                                    <ColorSwatch className={styles.swatchColor} color={swatchColor} />
                                ) : null}
                            </RacButton>
                            <Popover className={styles.popover} placement="bottom start" triggerRef={groupRef}>
                                <Dialog
                                    className={styles.dialog}
                                    aria-label={colorPalette}
                                    data-test-id="color-picker-dialog"
                                >
                                    <div className={styles.gestures} onKeyDownCapture={releasePointerGesture}>
                                        <ColorArea
                                            className={styles.area}
                                            colorSpace="hsb"
                                            xChannel="saturation"
                                            yChannel="brightness"
                                            data-test-id="color-picker-area"
                                            onChangeEnd={finishGesture}
                                            onPointerDown={startGesture}
                                        >
                                            <ColorThumb className={styles.thumb} />
                                        </ColorArea>
                                        <ColorSlider
                                            className={styles.hue}
                                            aria-label={colorHue}
                                            channel="hue"
                                            colorSpace="hsb"
                                            onChangeEnd={finishGesture}
                                        >
                                            <SliderTrack
                                                className={styles.hueTrack}
                                                onPointerDown={startGesture}
                                                data-test-id="color-picker-hue"
                                            >
                                                <ColorThumb className={styles.thumb} />
                                            </SliderTrack>
                                        </ColorSlider>
                                        {presetHexes.length > 0 ? (
                                            <ColorSwatchPicker aria-label={colorPresets} className={styles.presets}>
                                                {presetHexes.map(hex => (
                                                    <ColorSwatchPickerItem
                                                        key={hex}
                                                        className={styles.preset}
                                                        color={hex}
                                                        data-test-id={`color-picker-preset-${hex}`}
                                                    >
                                                        <ColorSwatch />
                                                    </ColorSwatchPickerItem>
                                                ))}
                                            </ColorSwatchPicker>
                                        ) : null}
                                    </div>
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
                            data-test-id="color-picker-input"
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
                                data-test-id="color-picker-clear"
                                excludeFromTabOrder
                                onPress={() => emit('')}
                            >
                                <Clear className={styles.icon} />
                            </RacButton>
                        ) : null}
                    </div>
                </div>
            </RacColorPicker>
        );
    }
);

ColorPicker.displayName = 'ColorPicker';
