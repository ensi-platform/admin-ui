import { type RefObject } from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCascadeDismiss } from '../hooks/useCascadeDismiss';
import { type ICascadeMenuItem } from '../utils';

const rootsA: ICascadeMenuItem[] = [{ code: 'products', text: 'Products' }];
const rootsB: ICascadeMenuItem[] = [{ code: 'orders', text: 'Orders' }];

const createRef = <T>(value: T): RefObject<T> => ({ current: value });

describe('useCascadeDismiss', () => {
    it('collapses when roots change', () => {
        const collapse = vi.fn();
        const rootRef = createRef<HTMLElement | null>(document.createElement('aside'));
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        const { rerender } = renderHook(
            ({ roots }) =>
                useCascadeDismiss({
                    roots,
                    openPathLength: 0,
                    collapse,
                    rootRef,
                    flyoutRefs,
                    contextMenuRef,
                }),
            { initialProps: { roots: rootsA } }
        );

        collapse.mockClear();
        rerender({ roots: rootsB });

        expect(collapse).toHaveBeenCalledTimes(1);
    });

    it('collapses on window resize when flyouts are open', () => {
        const collapse = vi.fn();
        const rootRef = createRef<HTMLElement | null>(document.createElement('aside'));
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 1,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();
        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(collapse).toHaveBeenCalledTimes(1);
    });

    it('does not collapse on resize when flyouts are closed', () => {
        const collapse = vi.fn();
        const rootRef = createRef<HTMLElement | null>(document.createElement('aside'));
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 0,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();
        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(collapse).not.toHaveBeenCalled();
    });

    it('collapses on scroll outside chrome when flyouts are open', () => {
        const collapse = vi.fn();
        const root = document.createElement('aside');
        const outside = document.createElement('div');
        document.body.append(root, outside);

        const rootRef = createRef<HTMLElement | null>(root);
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 1,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();
        act(() => {
            const event = new Event('scroll', { bubbles: true });
            Object.defineProperty(event, 'target', { value: outside });
            window.dispatchEvent(event);
        });

        expect(collapse).toHaveBeenCalledTimes(1);

        root.remove();
        outside.remove();
    });

    it('does not collapse on scroll inside root, flyout, or context menu', () => {
        const collapse = vi.fn();
        const root = document.createElement('aside');
        const flyout = document.createElement('div');
        const contextMenu = document.createElement('div');
        document.body.append(root, flyout, contextMenu);

        const rootRef = createRef<HTMLElement | null>(root);
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([flyout]);
        const contextMenuRef = createRef<HTMLDivElement | null>(contextMenu);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 1,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();

        [root, flyout, contextMenu].forEach(target => {
            act(() => {
                const event = new Event('scroll', { bubbles: true });
                Object.defineProperty(event, 'target', { value: target });
                window.dispatchEvent(event);
            });
        });

        expect(collapse).not.toHaveBeenCalled();

        root.remove();
        flyout.remove();
        contextMenu.remove();
    });

    it('does not collapse on scroll when flyouts are closed', () => {
        const collapse = vi.fn();
        const outside = document.createElement('div');
        document.body.append(outside);

        const rootRef = createRef<HTMLElement | null>(document.createElement('aside'));
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 0,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();
        act(() => {
            const event = new Event('scroll', { bubbles: true });
            Object.defineProperty(event, 'target', { value: outside });
            window.dispatchEvent(event);
        });

        expect(collapse).not.toHaveBeenCalled();

        outside.remove();
    });

    it('collapses on pointerdown outside chrome when flyouts are open', () => {
        const collapse = vi.fn();
        const root = document.createElement('aside');
        const outside = document.createElement('button');
        document.body.append(root, outside);

        const rootRef = createRef<HTMLElement | null>(root);
        const flyoutRefs = createRef<(HTMLDivElement | null)[]>([]);
        const contextMenuRef = createRef<HTMLDivElement | null>(null);

        renderHook(() =>
            useCascadeDismiss({
                roots: rootsA,
                openPathLength: 1,
                collapse,
                rootRef,
                flyoutRefs,
                contextMenuRef,
            })
        );

        collapse.mockClear();
        act(() => {
            outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });

        expect(collapse).toHaveBeenCalledTimes(1);

        root.remove();
        outside.remove();
    });
});
