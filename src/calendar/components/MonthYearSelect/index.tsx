import { useMemo, useRef } from 'react';

import cn from 'classnames';
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue, useLocale } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { ChevronDown } from '@/icons';

import { getMonthLabels } from '../../utils/date';

import styles from './styles.module.css';

export type TMonthYearSelectType = 'month' | 'year';

/** Caption select for calendar heading (Kontur-like). */
export interface IMonthYearSelectProps {
    type: TMonthYearSelectType;
    value: number;
    minValue: number;
    maxValue: number;
    onChange: (value: number) => void;
    /** Fires when the menu opens or closes. */
    onOpenChange?: (isOpen: boolean) => void;
    isDisabled?: boolean;
    'aria-label'?: string;
}

interface ISelectItem {
    id: string;
    label: string;
}

/** Build select items strictly within `minValue…maxValue` (no expand to typed value). */
export const buildMonthYearSelectItems = (
    type: TMonthYearSelectType,
    minValue: number,
    maxValue: number,
    monthLabels: readonly string[] = []
): ISelectItem[] => {
    if (maxValue < minValue) {
        return [];
    }

    if (type === 'month') {
        return Array.from({ length: maxValue - minValue + 1 }, (_, index) => {
            const month = minValue + index;

            return { id: String(month), label: monthLabels[month - 1] ?? String(month) };
        });
    }

    return Array.from({ length: maxValue - minValue + 1 }, (_, index) => {
        const year = minValue + index;

        return { id: String(year), label: String(year) };
    });
};

/** Month or year caption Select for sticky calendar heading. */
export const MonthYearSelect = ({
    type,
    value,
    minValue,
    maxValue,
    onChange,
    onOpenChange,
    isDisabled = false,
    'aria-label': ariaLabel,
}: IMonthYearSelectProps) => {
    const { locale } = useLocale();
    const listRef = useRef<HTMLDivElement>(null);
    const monthLabels = useMemo(() => getMonthLabels(locale), [locale]);

    const items = useMemo(
        () => buildMonthYearSelectItems(type, minValue, maxValue, monthLabels),
        [type, minValue, maxValue, monthLabels]
    );

    const selectedKey = String(value);
    const hasSelectedItem = items.some(item => item.id === selectedKey);
    const displayLabel = type === 'month' ? (monthLabels[value - 1] ?? String(value)) : String(value);
    const testId = type === 'month' ? 'calendar-month-select' : 'calendar-year-select';

    const scrollSelectedIntoView = () => {
        requestAnimationFrame(() => {
            const selected = listRef.current?.querySelector('[data-selected]');
            if (selected && typeof selected.scrollIntoView === 'function') {
                selected.scrollIntoView({ block: 'nearest' });
            }
        });
    };

    return (
        <Select
            aria-label={ariaLabel}
            selectedKey={hasSelectedItem ? selectedKey : null}
            isDisabled={isDisabled || items.length === 0}
            onOpenChange={isOpen => {
                onOpenChange?.(isOpen);
                if (isOpen) {
                    scrollSelectedIntoView();
                }
            }}
            onSelectionChange={key => {
                if (key == null) {
                    return;
                }
                const next = Number(key);
                if (!Number.isNaN(next) && next !== value) {
                    onChange(next);
                }
            }}
            className={styles.headingSelectRoot}
            data-test-id={testId}
        >
            <Button className={cn(styles.headingSelect, typographyStyles.bodyS)} data-test-id={`${testId}-trigger`}>
                <SelectValue>{() => displayLabel}</SelectValue>
                <ChevronDown className={styles.headingSelectIcon} aria-hidden />
            </Button>
            <Popover className={styles.headingMenu} placement="bottom start">
                <ListBox ref={listRef} className={styles.headingMenuList} items={items}>
                    {item => (
                        <ListBoxItem id={item.id} textValue={item.label} className={styles.headingMenuItem}>
                            {item.label}
                        </ListBoxItem>
                    )}
                </ListBox>
            </Popover>
        </Select>
    );
};

MonthYearSelect.displayName = 'MonthYearSelect';
