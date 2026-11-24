import cn from 'classnames';
import { Button, Collection, TreeItem, TreeItemContent } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { ChevronRight } from '@/icons';

import { type ITreeItem } from '../../types';

import styles from './styles.module.css';

interface ITreeRowProps {
    item: ITreeItem;
    readOnly?: boolean;
}

export const TreeRow = ({ item, readOnly = false }: ITreeRowProps) => {
    const children = item.children ?? [];

    return (
        <TreeItem id={item.id} textValue={item.label} className={styles.root} data-readonly={readOnly || undefined}>
            <TreeItemContent>
                {({ hasChildItems }) => (
                    <span className={styles.content}>
                        <span className={styles.chevronSlot}>
                            {hasChildItems ? (
                                <Button slot="chevron" className={styles.chevron}>
                                    <ChevronRight className={styles.icon} />
                                </Button>
                            ) : null}
                        </span>
                        <span className={cn(typographyStyles.bodyS, styles.label)}>{item.label}</span>
                    </span>
                )}
            </TreeItemContent>
            {children.length > 0 ? (
                <Collection items={children}>{child => <TreeRow item={child} readOnly={readOnly} />}</Collection>
            ) : null}
        </TreeItem>
    );
};

TreeRow.displayName = 'TreeRow';
