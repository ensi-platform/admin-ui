import cn from 'classnames';
import { Slider as AriaSlider } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';

import { useAuiLabels, useAuiLocale } from '@/provider';

import { RatingReadOnly, RatingTrack } from './components/Track';
import { ratingVariants } from './theme';
import { type IRatingProps } from './types';
import { formatRatingValue } from './utils';

export const Rating = supportRef(
    ({
        size = 'md',
        variant = 'primary',
        value,
        defaultValue,
        onChange,
        onBlur,
        minValue = 0,
        maxValue = 5,
        step = 0.5,
        readOnly = false,
        invalid = false,
        disabled = false,
        className,
        dataTestId,
        id,
        ref,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        ...props
    }: IRatingProps) => {
        const { ratingValue } = useAuiLabels();
        const locale = useAuiLocale();
        const textFor = (next: number) => formatRatingValue(ratingValue, next, maxValue, locale);
        const classNames = cn(ratingVariants({ size, variant }), className);

        if (readOnly && !disabled) {
            const shown = value ?? defaultValue ?? minValue;
            const valueText = textFor(shown);

            return (
                <div
                    role="img"
                    className={classNames}
                    data-test-id={dataTestId}
                    data-invalid={invalid || undefined}
                    aria-label={ariaLabel ? `${ariaLabel}, ${valueText}` : valueText}
                >
                    <RatingReadOnly
                        minValue={minValue}
                        maxValue={maxValue}
                        step={step}
                        displayValue={shown}
                        size={size}
                        variant={variant}
                    />
                </div>
            );
        }

        return (
            <AriaSlider
                {...props}
                className={classNames}
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
                <RatingTrack
                    ref={ref}
                    minValue={minValue}
                    maxValue={maxValue}
                    step={step}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                    invalid={invalid}
                    valueText={textFor}
                    onBlur={onBlur}
                    id={id}
                />
            </AriaSlider>
        );
    }
);

Rating.displayName = 'Rating';
