import { createRef, type MutableRefObject } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Submenus } from '../components/Submenus';
import { type IHoverLayer } from '../hooks/useHoverMenu';
import { type ICascadeMenuItem } from '../utils';

const roots: ICascadeMenuItem[] = [
    {
        text: 'Products',
        code: 'products',
        children: [{ text: 'Catalog', code: 'products_catalog', link: '/products/catalog' }],
    },
];

const noop = () => undefined;

describe('Submenus', () => {
    const renderSubmenus = (layers: IHoverLayer[], menuRoots: ICascadeMenuItem[]) => {
        const flyoutRefs: MutableRefObject<(HTMLDivElement | null)[]> = { current: [] };
        const rootRef = createRef<HTMLElement>();

        return render(
            <Submenus
                layers={layers}
                roots={menuRoots}
                pinnedRootItem={null}
                rootRef={rootRef}
                flyoutRefs={flyoutRefs}
                openCodes={new Set()}
                size="md"
                variant="primary"
                pinsEnabled={false}
                dataTestId="cascade"
                onChange={noop}
                onFolderEnter={noop}
                onLeafEnter={noop}
                onFolderLeave={noop}
                onLeafActivate={noop}
                getAimSubmenu={() => null}
                getAimMenuHeight={() => undefined}
                onMouseMove={noop}
                onItemContextMenu={noop}
                onCancelLeave={noop}
                onFlyoutChromeMove={() => noop}
            />
        );
    };

    it('skips flyout when layer parent has no children', () => {
        renderSubmenus([{ code: 'missing', anchor: { top: 0, left: 100 } }], roots);

        expect(screen.queryByTestId('cascade-col-1')).not.toBeInTheDocument();
    });

    it('skips flyout header when parent text is empty', () => {
        const emptyTextRoots: ICascadeMenuItem[] = [
            {
                code: 'empty-text',
                text: '',
                children: [{ code: 'leaf', text: 'Leaf', link: '/leaf' }],
            },
        ];

        renderSubmenus([{ code: 'empty-text', anchor: { top: 0, left: 100 } }], emptyTextRoots);

        expect(screen.getByTestId('cascade-col-1')).toBeInTheDocument();
        expect(screen.queryByTestId('cascade-col-1-header')).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Leaf/ })).toBeInTheDocument();
    });
});
