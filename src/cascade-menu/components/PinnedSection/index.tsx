import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { Pin } from '@/icons';

import { type ICascadeMenuItem } from '../../utils';
import { NavList, type INavListProps, type TNavListChrome } from '../NavList';

import styles from './styles.module.css';

export interface IPinnedSectionProps
    extends TNavListChrome, Pick<INavListProps, 'openCodes' | 'onFolderEnter' | 'onLeafEnter' | 'dataTestId'> {
    pinsEnabled: boolean;
    pinnedRootItem: ICascadeMenuItem | null;
    layoutCollapsed: boolean;
    pinnedSection: string;
    pinnedSectionHint: string;
    onTrimChrome: () => void;
}

/** L0 pinned entry: single Pinned folder, empty hint, or nothing. */
export const PinnedSection = ({
    pinsEnabled,
    pinnedRootItem,
    layoutCollapsed,
    pinnedSection,
    pinnedSectionHint,
    dataTestId,
    onTrimChrome,
    ...navListProps
}: IPinnedSectionProps) => {
    if (!pinsEnabled || (!pinnedRootItem && layoutCollapsed)) {
        return null;
    }

    return (
        <div className={styles.pinnedSection} data-test-id={dataTestId ? `${dataTestId}-pinned` : undefined}>
            {pinnedRootItem ? (
                <NavList
                    {...navListProps}
                    items={[pinnedRootItem]}
                    level={0}
                    collapsed={layoutCollapsed}
                    className={styles.pinnedColumn}
                    enablePins={pinsEnabled}
                    allowPin={false}
                    dataTestId={dataTestId ? `${dataTestId}-pinned-col` : undefined}
                />
            ) : null}
            {!pinnedRootItem && !layoutCollapsed ? (
                <>
                    <div
                        className={cn(styles.pinnedLabel, typographyStyles.bodyXs)}
                        onMouseEnter={onTrimChrome}
                        onMouseMove={onTrimChrome}
                    >
                        <Pin
                            className={styles.pinnedLabelIcon}
                            aria-hidden
                            focusable={false}
                            data-test-id={dataTestId ? `${dataTestId}-pinned-icon` : undefined}
                        />
                        <span>{pinnedSection}</span>
                    </div>
                    <div
                        className={cn(styles.pinnedEmpty, typographyStyles.bodyXs)}
                        data-test-id={dataTestId ? `${dataTestId}-pinned-empty` : undefined}
                        onMouseEnter={onTrimChrome}
                        onMouseMove={onTrimChrome}
                    >
                        {pinnedSectionHint}
                    </div>
                </>
            ) : null}
            <div className={styles.pinnedDivider} aria-hidden />
        </div>
    );
};

PinnedSection.displayName = 'CascadeMenu.PinnedSection';
