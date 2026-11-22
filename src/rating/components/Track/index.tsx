import {
    useContext,
    useLayoutEffect,
    useRef,
    useState,
    type FocusEventHandler,
    type PointerEvent,
    type Ref,
} from 'react';

import { SliderStateContext, SliderThumb, SliderTrack } from 'react-aria-components';

import { type TRatingSize, type TRatingVariant } from '../../types';
import { nextRatingValue, ratingStarCount, starFill, starZoneValues } from '../../utils';
import { RatingStar } from '../Star';

import styles from './styles.module.css';

const assignInputRef = (ref: Ref<HTMLInputElement> | undefined, node: HTMLInputElement | null) => {
    if (typeof ref === 'function') {
        ref(node);
        return;
    }

    if (ref) {
        ref.current = node;
    }
};

export interface IRatingStarsProps {
    minValue: number;
    maxValue: number;
    step: number;
    displayValue: number;
    size: TRatingSize;
    variant: TRatingVariant;
    preview?: boolean;
    disabled?: boolean;
    onPreview?: (zone: number | null) => void;
    onCommit?: (zone: number, dragged: boolean) => void;
    onFocusInput?: () => void;
}

export const RatingStars = ({
    minValue,
    maxValue,
    step,
    displayValue,
    size,
    variant,
    preview = false,
    disabled = false,
    onPreview,
    onCommit,
    onFocusInput,
}: IRatingStarsProps) => {
    const interactive = Boolean(onCommit);
    const dragRef = useRef<{ zone: number; moved: boolean } | null>(null);
    const count = ratingStarCount(minValue, maxValue);

    const finishPointer = () => {
        const drag = dragRef.current;

        dragRef.current = null;

        if (drag && !drag.moved) onCommit?.(drag.zone, false);
    };

    const onPointerDown = (zone: number) => (event: PointerEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (disabled || event.button !== 0) return;

        dragRef.current = { zone, moved: false };
        onFocusInput?.();
    };

    const stopTrackPointer = (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
    };

    const onPointerEnter = (zone: number) => () => {
        if (disabled) return;

        onPreview?.(zone);

        const drag = dragRef.current;

        if (!drag || drag.zone === zone) return;

        drag.moved = true;
        drag.zone = zone;
        onCommit?.(zone, true);
    };

    return (
        <>
            {Array.from({ length: count }, (_, index) => {
                const starIndex = index + 1;
                const zones = starZoneValues(starIndex, minValue, step);
                const fill = starFill(starIndex, minValue, displayValue);

                return (
                    <RatingStar key={starIndex} fill={fill} size={size} variant={variant} preview={preview}>
                        {interactive ? (
                            <span className={styles.zones} aria-hidden>
                                {zones.map(zone => (
                                    <button
                                        key={zone}
                                        type="button"
                                        tabIndex={-1}
                                        className={styles.zone}
                                        data-zone={zone}
                                        aria-label={String(zone)}
                                        onPointerDown={onPointerDown(zone)}
                                        onMouseDown={stopTrackPointer}
                                        onTouchStart={stopTrackPointer}
                                        onPointerEnter={onPointerEnter(zone)}
                                        onPointerUp={finishPointer}
                                        onPointerCancel={finishPointer}
                                    />
                                ))}
                            </span>
                        ) : null}
                    </RatingStar>
                );
            })}
        </>
    );
};

RatingStars.displayName = 'RatingStars';

export const RatingReadOnly = (props: IRatingStarsProps) => (
    <span className={styles.track}>
        <RatingStars {...props} />
    </span>
);

RatingReadOnly.displayName = 'RatingReadOnly';

export interface IRatingTrackProps {
    minValue: number;
    maxValue: number;
    step: number;
    size: TRatingSize;
    variant: TRatingVariant;
    disabled: boolean;
    invalid: boolean;
    valueText: (value: number) => string;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    id?: string;
    ref?: Ref<HTMLInputElement>;
}

export const RatingTrack = ({
    minValue,
    maxValue,
    step,
    size,
    variant,
    disabled,
    invalid,
    valueText,
    onBlur,
    id,
    ref,
}: IRatingTrackProps) => {
    const state = useContext(SliderStateContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<number | null>(null);
    const current = state?.getThumbValue(0) ?? minValue;
    const text = valueText(current);

    useLayoutEffect(() => {
        const input = inputRef.current;

        if (!input) return;

        // SliderThumb writes the raw number into aria-valuetext on every commit.
        input.setAttribute('aria-valuetext', text);

        if (!invalid) {
            input.removeAttribute('aria-invalid');
        }

        if (invalid) {
            input.setAttribute('aria-invalid', 'true');
        }

        assignInputRef(ref, input);

        return () => {
            assignInputRef(ref, null);
        };
    });

    const commit = (zone: number, dragged: boolean) => {
        if (!state || disabled) return;

        state.setThumbValue(0, nextRatingValue(state.getThumbValue(0), zone, dragged, minValue));
    };

    return (
        <SliderTrack
            className={styles.track}
            data-disabled={disabled || undefined}
            data-preview={preview === null ? undefined : ''}
            onPointerLeave={() => setPreview(null)}
        >
            <RatingStars
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                displayValue={preview ?? current}
                size={size}
                variant={variant}
                preview={preview !== null}
                disabled={disabled}
                onPreview={setPreview}
                onCommit={commit}
                onFocusInput={() => inputRef.current?.focus()}
            />
            <SliderThumb
                className={styles.thumb}
                id={id}
                inputRef={inputRef}
                onBlur={onBlur as FocusEventHandler<Element> | undefined}
            />
        </SliderTrack>
    );
};

RatingTrack.displayName = 'RatingTrack';
