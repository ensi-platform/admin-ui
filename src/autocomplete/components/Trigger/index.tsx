import { type RefObject } from 'react';

import { Button as RacButton, Group, Input } from 'react-aria-components';

import { ChevronDown } from '@/icons';

import { type TAutocompleteSize, type TAutocompleteVariant } from '../../types';
import { AutocompleteClearButton } from '../ClearButton';

import { autocompleteTriggerVariants } from './theme';

import styles from './styles.module.css';

export interface IAutocompleteTriggerProps {
    triggerRef: RefObject<HTMLDivElement | null>;
    size: TAutocompleteSize;
    variant: TAutocompleteVariant;
    clear: boolean;
    placeholder: string;
    isOpen: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
}

export const AutocompleteTrigger = ({
    triggerRef,
    size,
    variant,
    clear,
    placeholder,
    isOpen,
    isDisabled,
    isInvalid,
}: IAutocompleteTriggerProps) => (
    <div
        className={styles.triggerWrap}
        data-open={isOpen || undefined}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
    >
        <Group ref={triggerRef} className={autocompleteTriggerVariants({ size, variant })}>
            <Input className={styles.input} placeholder={placeholder} disabled={isDisabled} />
            <span className={styles.actions}>
                {clear ? <AutocompleteClearButton isDisabled={isDisabled} size={size} variant={variant} /> : null}
                <RacButton className={styles.chevronButton} isDisabled={isDisabled}>
                    <ChevronDown className={styles.chevron} />
                </RacButton>
            </span>
        </Group>
    </div>
);

AutocompleteTrigger.displayName = 'AutocompleteTrigger';
