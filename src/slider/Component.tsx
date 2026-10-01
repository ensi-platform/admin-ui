import { useContext, useLayoutEffect, useRef, type FocusEventHandler, type ReactNode, type Ref } from 'react';

import cn from 'classnames';
import {
    Slider as AriaSlider,
    SliderFill,
    SliderOutput,
    SliderStateContext,
    SliderThumb,
    SliderTrack,
} from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { sliderVariants } from './theme';
import { type ISliderProps } from './types';
import { sliderTicks } from './utils';

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

const SliderDetail = ({ formatDetail }: { formatDetail?: (value: number) => ReactNode }) => {
    const state = useContext(SliderStateContext);

    if (!formatDetail || !state) return null;

    return <span className={styles.detail}>{formatDetail(state.getThumbValue(0))}</span>;
};

export const Slider = supportRef(
    ({
        size = 'md',
        variant = 'primary',
        value,
        defaultValue,
        onChange,
        onBlur,
        minValue = 0,
        maxValue = 100,
        step = 1,
        ticks = true,
        formatValue,
        formatDetail,
        invalid = false,
        disabled = false,
        block = true,
        className,
        dataTestId,
        id,
        ref,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        ...props
    }: ISliderProps) => {
        const marks = ticks ? sliderTicks(minValue, maxValue, step) : [];
        const inputRef = useRef<HTMLInputElement>(null);

        useLayoutEffect(() => {
            assignInputRef(ref, inputRef.current);

            return () => {
                assignInputRef(ref, null);
            };
        }, [ref]);

        return (
            <AriaSlider
                {...props}
                className={cn(sliderVariants({ size, variant, block }), invalid && styles.invalid, className)}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                isDisabled={disabled}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                data-invalid={invalid || undefined}
                data-test-id={dataTestId}
            >
                <div className={styles.readout} aria-hidden>
                    <SliderOutput className={styles.value}>
                        {({ state }) => {
                            const current = state.getThumbValue(0);

                            return formatValue ? formatValue(current) : current;
                        }}
                    </SliderOutput>
                    <SliderDetail formatDetail={formatDetail} />
                </div>
                <SliderTrack className={styles.track}>
                    <div className={styles.rail}>
                        <SliderFill className={styles.fill} />
                    </div>
                    {marks.length > 0 ? (
                        <div className={styles.ticks} aria-hidden>
                            {marks.map(mark => (
                                <span key={mark.value} className={styles.tick} style={{ left: mark.offset }} />
                            ))}
                        </div>
                    ) : null}
                    <SliderThumb
                        className={styles.thumb}
                        id={id}
                        inputRef={inputRef}
                        onBlur={onBlur as FocusEventHandler<Element> | undefined}
                    />
                </SliderTrack>
            </AriaSlider>
        );
    }
);

Slider.displayName = 'Slider';
