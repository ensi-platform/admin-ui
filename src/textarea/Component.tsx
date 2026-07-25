import { type ChangeEventHandler, useRef, useState } from 'react';

import cn from 'classnames';
import { Group, TextArea as RacTextArea } from 'react-aria-components';

import { Clear } from '@/icons';
import { useAuiLabels } from '@/provider';

import { textAreaVariants } from './theme';
import { type ITextAreaProps } from './types';
import { clearTextAreaElementValue, toEmptyTextAreaChangeEvent } from './utils';

import styles from './styles.module.css';

const toStringValue = (value: unknown) => (value == null ? '' : String(value));

const assignRef = <T,>(ref: ITextAreaProps['ref'], node: T | null) => {
    if (typeof ref === 'function') {
        ref(node as never);
        return;
    }

    if (ref) {
        ref.current = node as never;
    }
};

const TextAreaClearButton = ({ onClear }: { onClear: () => void }) => {
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

export const TextArea = ({
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
}: ITextAreaProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(() => toStringValue(defaultValue));
    const currentValue = isControlled ? toStringValue(value) : uncontrolledValue;
    const showClear = clear && !disabled && currentValue !== '';

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
        if (!isControlled) {
            setUncontrolledValue(event.target.value);
        }

        onChange?.(event);
    };

    const emitEmptyChange = () => {
        const el = textAreaRef.current;
        const event = toEmptyTextAreaChangeEvent(el);

        clearTextAreaElementValue(el);

        if (!isControlled) {
            setUncontrolledValue('');
        }

        onChange?.(event);
    };

    return (
        <Group
            className={cn(textAreaVariants({ size, variant, block }), className)}
            data-test-id={dataTestId}
            isInvalid={invalid}
            isDisabled={disabled}
        >
            <RacTextArea
                {...props}
                ref={node => {
                    textAreaRef.current = node;
                    assignRef(ref, node);
                }}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={styles.fieldInput}
            />
            {showClear ? <TextAreaClearButton onClear={emitEmptyChange} /> : null}
        </Group>
    );
};

TextArea.displayName = 'TextArea';
