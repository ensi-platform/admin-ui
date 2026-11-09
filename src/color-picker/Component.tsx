import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import {
    ColorArea,
    ColorPicker as RacColorPicker,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
    ColorSwatchPickerItem,
    ColorThumb,
    SliderTrack,
    type Color,
} from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { useAuiLabels } from '@/provider';

import { type IColorPickerProps } from './types';
import { hexOf, IDLE_DRAFT, toDraftColor, toHexColor, validPresetHexes, withStoredHue } from './utils';

import styles from './styles.module.css';

const draftFrom = (value: string | undefined, hue: number | undefined) =>
    withStoredHue(toDraftColor(toHexColor(value ?? '') ?? IDLE_DRAFT), hue);

const toHsb = (color: Color) => color.toFormat('hsb');

export const ColorPicker = supportRef(
    ({
        ref,
        value,
        defaultValue,
        onChange,
        onPreview,
        onHueChange,
        hue,
        presets,
        disabled = false,
        className,
        dataTestId,
        'aria-label': ariaLabel,
    }: IColorPickerProps) => {
        const { colorHue, colorPresets } = useAuiLabels();
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
        const current = isControlled ? value : uncontrolledValue;
        const [draft, setDraft] = useState<Color>(() => draftFrom(current, hue));
        const draggingRef = useRef(false);
        const lastEmittedRef = useRef(current);
        const presetHexes = validPresetHexes(presets);

        useEffect(() => {
            lastEmittedRef.current = current;
        }, [current]);

        useEffect(() => {
            if (draggingRef.current) return;

            const hex = toHexColor(current) ?? IDLE_DRAFT;

            setDraft(prev => withStoredHue(hexOf(prev) === hex ? prev : toDraftColor(hex), hue));
        }, [current, hue]);

        const commit = (hex: string) => {
            if (disabled || lastEmittedRef.current === hex) return;

            lastEmittedRef.current = hex;

            if (!isControlled) setUncontrolledValue(hex);

            if (hex === current) return;

            onChange?.(hex);
        };

        const onPickerChange = (color: Color) => {
            if (disabled) return;

            const next = toHsb(color);
            const hex = hexOf(next);

            setDraft(next);
            onHueChange?.(next.getChannelValue('hue'));

            if (draggingRef.current) {
                onPreview?.(hex);

                return;
            }

            commit(hex);
        };

        const finishGesture = (color: Color) => {
            if (disabled) return;

            const next = toHsb(color);

            draggingRef.current = false;
            setDraft(next);
            onHueChange?.(next.getChannelValue('hue'));
            commit(hexOf(next));
        };

        const releasePointerGesture = () => {
            draggingRef.current = false;
        };

        const startGesture = () => {
            draggingRef.current = true;
        };

        return (
            <RacColorPicker value={draft} onChange={onPickerChange}>
                <div
                    ref={ref}
                    className={cn(styles.root, className)}
                    data-test-id={dataTestId}
                    role={ariaLabel ? 'group' : undefined}
                    aria-label={ariaLabel}
                    onKeyDownCapture={releasePointerGesture}
                >
                    <ColorArea
                        className={styles.area}
                        colorSpace="hsb"
                        xChannel="saturation"
                        yChannel="brightness"
                        isDisabled={disabled}
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
                        isDisabled={disabled}
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
                                    isDisabled={disabled}
                                    data-test-id={`color-picker-preset-${hex}`}
                                >
                                    <ColorSwatch />
                                </ColorSwatchPickerItem>
                            ))}
                        </ColorSwatchPicker>
                    ) : null}
                </div>
            </RacColorPicker>
        );
    }
);

ColorPicker.displayName = 'ColorPicker';
