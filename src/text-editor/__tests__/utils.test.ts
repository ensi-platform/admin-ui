import { describe, expect, it } from 'vitest';

import {
    editorContentFromValue,
    isEmptyDoc,
    isSafeUrl,
    normalizeUrl,
    partitionHtml,
    prepareHtmlForEditor,
    stripWordHtml,
    visibleText,
} from '../utils';

describe('normalizeUrl', () => {
    it.each([
        [' https://ensi.tech/a ', 'https://ensi.tech/a'],
        ['/docs', '/docs'],
        ['#anchor', '#anchor'],
        // The scheme is built at runtime so the lint rule does not treat the fixture as an eval URL.
        [['java', 'script:alert(1)'].join(''), null],
        ['', null],
        ['data:text/html,hi', null],
    ])('normalizes %j', (value, expected) => {
        expect(normalizeUrl(value)).toBe(expected);
    });

    it('rejects a javascript scheme with a space before the colon', () => {
        expect(isSafeUrl('javascript :alert(1)')).toBe(false);
    });
});

describe('isEmptyDoc', () => {
    it.each([
        ['', true],
        ['<p></p>', true],
        ['<p><br></p>', true],
        ['<p>a</p>', false],
        ['<img src="/a.png">', false],
        ['<iframe src="/a"></iframe>', false],
        ['<div class="banner"></div>', false],
    ])('reads %j as empty=%s', (html, expected) => {
        expect(isEmptyDoc(html)).toBe(expected);
    });
});

describe('partitionHtml', () => {
    it('keeps a foreign block as the original substring', () => {
        const html = '<div class="banner"><span style="color:red">x</span></div>';

        expect(partitionHtml(html)).toEqual([{ kind: 'foreign', html }]);
    });

    it('splits schema markup and a foreign block without rewriting the foreign slice', () => {
        const foreign = '<section id="s">keep</section>';
        const html = `<p>A</p>${foreign}<table><tr><td>a</td></tr></table>`;
        const parts = partitionHtml(html);

        expect(parts.map(part => part.kind)).toEqual(['schema', 'foreign', 'schema']);
        expect(parts[1]?.html).toBe(foreign);
        expect(parts.map(part => part.html).join('')).toBe(html);
    });

    it('stores the foreign slice in a placeholder the editor can parse', () => {
        const foreign = '<div class="banner">keep</div>';
        const prepared = prepareHtmlForEditor(`<p>A</p>${foreign}`);

        expect(prepared).toContain('<p>A</p>');
        expect(prepared).toContain(encodeURIComponent(foreign));
        expect(editorContentFromValue('')).toBe('<p></p>');
        expect(editorContentFromValue('<script></script>')).toContain(encodeURIComponent('<script></script>'));
        expect(visibleText('<p>Hi</p>')).toBe('Hi');
    });
});

describe('stripWordHtml', () => {
    it('drops mso classes, mso styles, and Office tags', () => {
        const html =
            '<!--[if gte mso 9]><xml></xml><![endif]--><p class="MsoNormal" style="mso-margin-top-alt:auto;color:red">Hi<o:p></o:p></p>';

        expect(stripWordHtml(html)).toBe('<p style="color:red">Hi</p>');
    });
});
