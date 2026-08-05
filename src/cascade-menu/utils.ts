import { type TSVGRIcon } from '@ds/common';

/** Cascade menu tree node (Ensi/Auchan-shaped). */
export interface ICascadeMenuItem {
    text: string;
    code: string;
    link?: string;
    icon?: TSVGRIcon;
    children?: ICascadeMenuItem[];
}

/** localStorage key prefix — append pinUserId. */
export const PIN_STORAGE_PREFIX = 'aui-cascade-menu-pins:';

/** Default max pinned codes. */
export const DEFAULT_MAX_PINNED = 8;

/** Keep leaves allowed by codes; drop empty branches. */
export const filterCascadeMenuItems = (items: ICascadeMenuItem[], allowedCodes?: string[]): ICascadeMenuItem[] => {
    if (!allowedCodes) {
        return items;
    }

    const allowed = new Set(allowedCodes);

    const walk = (nodes: ICascadeMenuItem[]): ICascadeMenuItem[] =>
        nodes.flatMap(node => {
            if (node.children?.length) {
                const children = walk(node.children);

                if (children.length === 0) {
                    return [];
                }

                return [{ ...node, children }];
            }

            if (node.link && allowed.has(node.code)) {
                return [node];
            }

            return [];
        });

    return walk(items);
};

/** Active leaf code by matching pathname against link (RegExp like Ensi Sidebar). */
export const findActiveCodeByPath = (items: ICascadeMenuItem[], activePath?: string): string | undefined => {
    if (!activePath) {
        return undefined;
    }

    let matched: string | undefined;

    const walk = (nodes: ICascadeMenuItem[]) => {
        nodes.forEach(node => {
            if (node.link && new RegExp(node.link).test(activePath)) {
                matched = node.code;
            }

            if (node.children) {
                walk(node.children);
            }
        });
    };

    walk(items);

    return matched;
};

/** Ancestor codes from root to parent of `code` (excludes `code`). */
export const findAncestorCodes = (items: ICascadeMenuItem[], code: string): string[] => {
    const walk = (nodes: ICascadeMenuItem[], trail: string[]): string[] | undefined => {
        let result: string[] | undefined;

        nodes.some(node => {
            if (node.code === code) {
                result = trail;
                return true;
            }

            if (node.children?.length) {
                const nested = walk(node.children, [...trail, node.code]);

                if (nested) {
                    result = nested;
                    return true;
                }
            }

            return false;
        });

        return result;
    };

    return walk(items, []) ?? [];
};

/** Find node by code in tree. */
export const findCascadeMenuItem = (items: ICascadeMenuItem[], code: string): ICascadeMenuItem | undefined => {
    let found: ICascadeMenuItem | undefined;

    items.some(node => {
        if (node.code === code) {
            found = node;
            return true;
        }

        if (node.children?.length) {
            found = findCascadeMenuItem(node.children, code);
            return Boolean(found);
        }

        return false;
    });

    return found;
};

/** Whether code is an L0 root item (not pinnable). */
export const isCascadeRootCode = (roots: ICascadeMenuItem[], code: string): boolean =>
    roots.some(root => root.code === code);

/** Resolve pin codes to tree nodes; drop missing, empty folders, and L0 roots; keep order. */
export const resolvePinnedItems = (roots: ICascadeMenuItem[], codes: string[]): ICascadeMenuItem[] => {
    const rootCodes = new Set(roots.map(root => root.code));
    const seen = new Set<string>();

    return codes.flatMap(code => {
        if (seen.has(code) || rootCodes.has(code)) {
            return [];
        }

        seen.add(code);
        const node = findCascadeMenuItem(roots, code);

        if (!node || node.children?.length === 0) {
            return [];
        }

        return [node];
    });
};

/**
 * Toggle code in pinned list.
 * Unpin if present; pin if under max; otherwise leave unchanged.
 */
export const togglePinnedCode = (codes: string[], code: string, max: number = DEFAULT_MAX_PINNED): string[] => {
    if (codes.includes(code)) {
        return codes.filter(item => item !== code);
    }

    if (codes.length >= max) {
        return codes;
    }

    return [...codes, code];
};

/** Cascade L0 / flyouts / context-menu chrome roots for hit-testing. */
export interface ICascadeChromeRoots {
    root?: Node | null;
    flyouts?: (Node | null | undefined)[];
    contextMenu?: Node | null;
}

/** Whether node is inside cascade L0 / flyouts / context menu. */
export const isNodeInsideCascadeChrome = (node: Node | null | undefined, chrome: ICascadeChromeRoots): boolean => {
    if (!node) {
        return false;
    }

    if (chrome.root?.contains(node)) {
        return true;
    }

    if (chrome.contextMenu?.contains(node)) {
        return true;
    }

    return Boolean(chrome.flyouts?.some(el => el?.contains(node)));
};
