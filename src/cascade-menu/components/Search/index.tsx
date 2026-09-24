import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import cn from 'classnames';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import { Clear, Search as SearchIcon } from '@/icons';
import { useAuiLabels, useAuiLink } from '@/provider';

import { searchCascadeMenu, type ICascadeMenuItem } from '../../utils';

import { SearchContext } from './context';

import styles from './styles.module.css';

export interface ISearchProps {
    children: ReactNode;
    items: ICascadeMenuItem[];
    dataTestId?: string;
    onActivate: (code: string) => void;
    onEngage: () => void;
}

/** Full-screen section search opened from the header button. */
export const Search = ({ children, items, dataTestId, onActivate, onEngage }: ISearchProps) => {
    const { searchMenu, searchMenuEmpty, clear } = useAuiLabels();
    const LinkComponent = useAuiLink();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const hitRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const listId = useId();
    const hits = useMemo(() => searchCascadeMenu(items, query), [items, query]);
    const showResults = query.trim().length > 0;
    const activeId = showResults && hits[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined;

    const openSearch = useCallback(() => {
        setQuery('');
        setActiveIndex(0);
        onEngage();
        setOpen(true);
    }, [onEngage]);

    const contextValue = useMemo(
        () => ({
            open,
            searchMenu,
            dataTestId,
            openSearch,
        }),
        [dataTestId, open, openSearch, searchMenu]
    );

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    const close = () => {
        setOpen(false);
    };

    const updateQuery = (value: string) => {
        setQuery(value);
        setActiveIndex(0);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!showResults || hits.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex(index => (index + 1) % hits.length);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex(index => (index - 1 + hits.length) % hits.length);
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            hitRefs.current[activeIndex]?.click();
        }
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
            <ModalOverlay
                isOpen={open}
                isDismissable
                onOpenChange={() => {
                    close();
                }}
                className={styles.overlay}
                style={{ alignItems: 'flex-start', paddingTop: 'var(--aui-cascade-menu-search-offset-y, 25vh)' }}
            >
                <Modal className={styles.screen}>
                    <Dialog className={styles.dialog} aria-label={searchMenu}>
                        <div className={styles.field}>
                            <SearchIcon className={styles.icon} />
                            <input
                                ref={inputRef}
                                type="search"
                                role="combobox"
                                className={cn(styles.input, typographyStyles.bodySTight)}
                                placeholder={searchMenu}
                                aria-label={searchMenu}
                                aria-expanded={showResults}
                                aria-controls={showResults ? listId : undefined}
                                aria-activedescendant={activeId}
                                aria-autocomplete="list"
                                autoComplete="off"
                                value={query}
                                data-test-id={dataTestId ? `${dataTestId}-search` : undefined}
                                onChange={event => updateQuery(event.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            {query ? (
                                <button
                                    type="button"
                                    className={styles.clear}
                                    aria-label={clear}
                                    data-test-id={dataTestId ? `${dataTestId}-search-clear` : undefined}
                                    onMouseDown={event => event.preventDefault()}
                                    onClick={() => updateQuery('')}
                                >
                                    <Clear className={styles.clearIcon} />
                                </button>
                            ) : null}
                        </div>
                        <div
                            id={listId}
                            className={styles.results}
                            role={hits.length > 0 ? 'listbox' : undefined}
                            aria-label={hits.length > 0 ? searchMenu : undefined}
                            data-test-id={dataTestId ? `${dataTestId}-search-panel` : undefined}
                        >
                            {showResults && hits.length === 0 ? (
                                <p className={cn(styles.empty, typographyStyles.bodyS)} role="status">
                                    {searchMenuEmpty}
                                </p>
                            ) : (
                                hits.map((hit, index) => (
                                    <LinkComponent
                                        key={hit.code}
                                        ref={(node: HTMLAnchorElement | null) => {
                                            hitRefs.current[index] = node;
                                        }}
                                        id={`${listId}-opt-${index}`}
                                        role="option"
                                        aria-selected={index === activeIndex}
                                        href={hit.link}
                                        className={cn(styles.hit, typographyStyles.bodySTight)}
                                        data-active={index === activeIndex || undefined}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => {
                                            onActivate(hit.code);
                                            close();
                                        }}
                                    >
                                        <span>{hit.text}</span>
                                        {hit.path.length > 0 ? (
                                            <span className={cn(styles.path, typographyStyles.bodyXs)}>
                                                {hit.path.join(' / ')}
                                            </span>
                                        ) : null}
                                    </LinkComponent>
                                ))
                            )}
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </SearchContext.Provider>
    );
};

Search.displayName = 'CascadeMenu.Search';
