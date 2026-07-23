import cn from 'classnames';

import { Clear } from '../icons/index.js';
import { useAuiLabels } from '../provider/index.js';

import { tagVariants } from './theme.js';
import { type ITagProps } from './types.js';

import styles from './styles.module.css';

const TagRemoveButton = ({ onRemove, disabled }: { onRemove: () => void; disabled: boolean }) => {
    const { clear } = useAuiLabels();

    return (
        <button
            type="button"
            className={styles.remove}
            aria-label={clear}
            disabled={disabled}
            onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                onRemove();
            }}
            onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
            }}
        >
            <Clear className={styles.removeIcon} />
        </button>
    );
};

export const Tag = ({
    ref,
    children,
    size = 'md',
    onRemove,
    disabled = false,
    className,
    dataTestId,
    ...props
}: ITagProps) => (
    <span
        {...props}
        ref={ref}
        className={cn(tagVariants({ size }), className)}
        data-disabled={disabled || undefined}
        data-test-id={dataTestId}
    >
        <span className={styles.label}>{children}</span>
        {onRemove ? <TagRemoveButton onRemove={onRemove} disabled={disabled} /> : null}
    </span>
);

Tag.displayName = 'Tag';
