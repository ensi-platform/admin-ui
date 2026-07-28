import { useId, useMemo } from 'react';

import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { useAuiLabels } from '@/provider';
import { Select, type IComboboxOption, type TComboboxValue } from '@/select';

import { type ITablePageSizeProps } from './types';

import styles from './styles.module.css';

const DEFAULT_OPTIONS = [10, 25, 50, 100];

export const TablePageSize = ({
    ref,
    value,
    onChange,
    options = DEFAULT_OPTIONS,
    label,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ITablePageSizeProps) => {
    const { pageSize: pageSizeLabel } = useAuiLabels();
    const resolvedLabel = label ?? pageSizeLabel;
    const labelId = useId();
    const selectOptions = useMemo<IComboboxOption[]>(
        () => options.map(size => ({ value: size, label: String(size) })),
        [options]
    );

    const handleChange = (next: TComboboxValue | null) => {
        if (next == null) return;
        onChange(typeof next === 'number' ? next : Number(next));
    };

    return (
        <div
            {...props}
            ref={ref}
            className={cn(styles.root, typographyStyles.bodyS, className)}
            data-test-id={dataTestId}
        >
            <span id={labelId} className={styles.label}>
                {resolvedLabel}
            </span>
            <Select
                className={styles.select}
                size="sm"
                block={false}
                clear={false}
                disabled={disabled}
                value={value}
                options={selectOptions}
                onChange={handleChange}
                aria-labelledby={labelId}
            />
        </div>
    );
};

TablePageSize.displayName = 'Table.PageSize';
