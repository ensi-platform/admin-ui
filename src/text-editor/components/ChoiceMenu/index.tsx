import { useState } from 'react';

import { Button } from '@/button';
import { Popover } from '@/popover';

import styles from './styles.module.css';

export interface IChoiceOption {
    id: string;
    label: string;
    active?: boolean;
    onSelect: () => void;
}

/** Toolbar menu: one trigger, a list of commands. */
export const ChoiceMenu = ({
    label,
    disabled,
    pressed,
    options,
}: {
    label: string;
    disabled?: boolean;
    pressed?: boolean;
    options: IChoiceOption[];
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover isOpen={open} onOpenChange={setOpen}>
            <Popover.Trigger>
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={disabled}
                    aria-label={label}
                    aria-pressed={pressed || undefined}
                    onMouseDown={event => event.preventDefault()}
                >
                    {label}
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <div className={styles.list} role="group" aria-label={label}>
                    {options.map(option => (
                        <Button
                            key={option.id}
                            type="button"
                            size="sm"
                            variant="secondary"
                            aria-pressed={option.active || undefined}
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => {
                                option.onSelect();
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </Popover.Content>
        </Popover>
    );
};
