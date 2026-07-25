import { type ChangeEventHandler, useRef, useState } from 'react';

import cn from 'classnames';
import { Group, Input as RacInput } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { inputVariants } from './theme';
import { type IInputProps } from './types';
import { clearInputElementValue, toEmptyInputChangeEvent } from './utils';

import styles from './styles.module.css';

const toStringValue = (value: unknown) => (value == null ? '' : String(value));

const assignRef = <T,>(ref: IInputProps['ref'], node: T | null) => {
    if (typeof ref === 'function') {
        ref(node as never);
        return;
    }

    if (ref) {
        ref.current = node as never;
    }
};

const InputClearButton = ({ onClear }: { onClear: () => void }) => {
    const { clear } = useAuiLabels();

    return (
        <button
            type="button"
            className={styles.clear}
            aria-label={clear}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                onClear();
            }}
        >
            <Clear className={styles.clearIcon} />
        </button>
    );
};

export const Input = ({
    ref,
    size = 'md',
    variant = 'primary',
    block = true,
    invalid = false,
    disabled = false,
    clear = false,
    className,
    dataTestId,
    value,
    defaultValue,
    onChange,
    ...props
}: IInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(() => toStringValue(defaultValue));
    const currentValue = isControlled ? toStringValue(value) : uncontrolledValue;
    const showClear = clear && !disabled && currentValue !== '';

    const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
        if (!isControlled) {
            setUncontrolledValue(event.target.value);
        }

        onChange?.(event);
    };

    const emitEmptyChange = () => {
        const el = inputRef.current;
        const event = toEmptyInputChangeEvent(el);

        clearInputElementValue(el);

        if (!isControlled) {
            setUncontrolledValue('');
        }

        onChange?.(event);
    };

    return (
        <Group
            className={cn(inputVariants({ size, variant, block }), className)}
            data-test-id={dataTestId}
            isInvalid={invalid}
            isDisabled={disabled}
        >
            <RacInput
                {...props}
                ref={node => {
                    inputRef.current = node;
                    assignRef(ref, node);
                }}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={styles.fieldInput}
            />
            {showClear ? <InputClearButton onClear={emitEmptyChange} /> : null}
        </Group>
    );
};

Input.displayName = 'Input';
