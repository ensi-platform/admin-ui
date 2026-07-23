import cn from 'classnames';
import { Select as RacSelect } from 'react-aria-components';

import { type ISelectProps, type TSelectValue } from '../../types.js';
import { toSelectedKey } from '../../utils.js';
import { SelectList } from '../List/index.js';
import { SelectTrigger } from '../Trigger/index.js';

import styles from './styles.module.css';

export const SelectRoot = ({
    ref,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    clear = false,
    size = 'md',
    isInvalid = false,
    disabled = false,
    className,
    dataTestId,
    onBlur,
    ...props
}: ISelectProps) => {
    const selectedKey = toSelectedKey(value);
    const defaultSelectedKey = toSelectedKey(defaultValue);

    return (
        <RacSelect
            {...props}
            ref={ref}
            selectedKey={selectedKey}
            defaultSelectedKey={defaultSelectedKey}
            onSelectionChange={key => {
                onChange?.(key as TSelectValue | null);
            }}
            placeholder={placeholder ?? ''}
            isDisabled={disabled}
            isInvalid={isInvalid}
            onBlur={onBlur}
            data-invalid={isInvalid || undefined}
            data-test-id={dataTestId}
            className={cn(styles.root, className)}
        >
            {({ isFocusVisible, isOpen, isDisabled: isSelectDisabled, isInvalid: isSelectInvalid }) => (
                <>
                    <SelectTrigger
                        size={size}
                        clear={clear}
                        isFocusVisible={isFocusVisible}
                        isOpen={isOpen}
                        isDisabled={isSelectDisabled}
                        isInvalid={isSelectInvalid}
                    />
                    <SelectList options={options} size={size} />
                </>
            )}
        </RacSelect>
    );
};

SelectRoot.displayName = 'Select';
