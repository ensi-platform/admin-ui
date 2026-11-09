import { describe, expect, it } from 'vitest';

import { type IDropzoneFile } from '../types';
import {
    DROPZONE_REJECT,
    fillLabel,
    formatFileSize,
    dropzoneQuota,
    formatDropzoneLimits,
    dropTargetRowKey,
    moveDropzoneFiles,
    reorderDropzoneFiles,
    takeIncomingFiles,
} from '../utils';

const file = (name: string, type = 'text/plain') => new File(['x'], name, { type });

const item = (id: string, name: string): IDropzoneFile => ({
    id,
    name,
    size: 1,
    type: 'text/plain',
});

describe('dropzone utils', () => {
    it('formats sizes in bytes, kilobytes, and megabytes without rounding up a unit', () => {
        const units = { byte: '{size} B', kilobyte: '{size} KB', megabyte: '{size} MB' };

        expect(formatFileSize(0, units)).toBe('0 B');
        expect(formatFileSize(1, units)).toBe('1 B');
        expect(formatFileSize(1024, units)).toBe('1 KB');
        expect(formatFileSize(1536, units)).toBe('1.5 KB');
        expect(formatFileSize(1024 * 1024, units)).toBe('1 MB');
        expect(formatFileSize(Math.round(1.1 * 1024 * 1024), units)).toBe('1.1 MB');
    });

    it('fills label placeholders and leaves unknown keys empty', () => {
        expect(fillLabel('Файл больше {size}', { size: '1 MB' })).toBe('Файл больше 1 MB');
        expect(fillLabel('{count}', {})).toBe('');
    });

    it('still assigns an id when randomUUID throws', () => {
        const { randomUUID } = crypto;

        Object.defineProperty(crypto, 'randomUUID', {
            configurable: true,
            value: () => {
                throw new TypeError('not a secure context');
            },
        });

        try {
            const result = takeIncomingFiles([], [file('a.txt')], []);

            expect(result.added[0]?.id).toEqual(expect.any(String));
            expect(result.added[0]?.id.length).toBeGreaterThan(0);
        } finally {
            Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: randomUUID });
        }
    });

    it('adds a new file and skips a duplicate name', () => {
        const result = takeIncomingFiles([item('a', 'a.txt')], [file('a.txt'), file('b.txt')], [], {
            createId: () => 'b',
        });

        expect(result.added.map(entry => entry.name)).toEqual(['b.txt']);
        expect(result.codes).toEqual([DROPZONE_REJECT.duplicate]);
        expect(result.added[0]?.file).toBeInstanceOf(File);
    });

    it('keeps files that fit maxFiles and rejects the rest', () => {
        const result = takeIncomingFiles([item('a', 'a.txt')], [file('b.txt'), file('c.txt')], [], {
            maxFiles: 2,
            createId: () => 'next',
        });

        expect(result.added.map(entry => entry.name)).toEqual(['b.txt']);
        expect(result.codes).toEqual([DROPZONE_REJECT.tooMany]);
    });

    it('rejects a batch when the list is already full', () => {
        const result = takeIncomingFiles([item('a', 'a.txt')], [file('b.txt')], [], { maxFiles: 1 });

        expect(result.added).toEqual([]);
        expect(result.codes).toEqual([DROPZONE_REJECT.tooMany]);
    });

    it('keeps rejection codes and does not add those files', () => {
        const rejected = file('big.txt');
        const result = takeIncomingFiles([], [file('ok.txt')], [{ file: rejected, codes: [DROPZONE_REJECT.tooBig] }], {
            createId: () => 'ok',
        });

        expect(result.added.map(entry => entry.name)).toEqual(['ok.txt']);
        expect(result.codes).toEqual([DROPZONE_REJECT.tooBig]);
    });

    it('moves a file after the target and ignores a drop onto itself', () => {
        const files = [item('a', 'a.txt'), item('b', 'b.txt'), item('c', 'c.txt')];

        expect(reorderDropzoneFiles(files, ['a'], 'c', 'after').map(entry => entry.id)).toEqual(['b', 'c', 'a']);
        expect(reorderDropzoneFiles(files, ['a'], 'a', 'on').map(entry => entry.id)).toEqual(['a', 'b', 'c']);
    });

    it('lands a file on the target row when moving down or up', () => {
        const files = [item('a', 'a.txt'), item('b', 'b.txt'), item('c', 'c.txt'), item('d', 'd.txt')];

        expect(moveDropzoneFiles(files, ['a'], 'c').map(entry => entry.id)).toEqual(['b', 'c', 'a', 'd']);
        expect(moveDropzoneFiles(files, ['d'], 'b').map(entry => entry.id)).toEqual(['a', 'd', 'b', 'c']);
        expect(moveDropzoneFiles(files, ['b'], 'a').map(entry => entry.id)).toEqual(['b', 'a', 'c', 'd']);
        expect(moveDropzoneFiles(files, ['a'], 'd').map(entry => entry.id)).toEqual(['b', 'c', 'd', 'a']);
        expect(moveDropzoneFiles(files, ['a'], 'a').map(entry => entry.id)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('moves a group onto the target row and keeps the group order', () => {
        const files = [item('a', 'a.txt'), item('b', 'b.txt'), item('c', 'c.txt'), item('d', 'd.txt')];

        expect(moveDropzoneFiles(files, ['a', 'b'], 'd').map(entry => entry.id)).toEqual(['c', 'd', 'a', 'b']);
        expect(moveDropzoneFiles(files, ['c', 'd'], 'a').map(entry => entry.id)).toEqual(['c', 'd', 'a', 'b']);
        expect(moveDropzoneFiles(files, ['a', 'c'], 'c').map(entry => entry.id)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('treats the whole row as the drop target, including its lower half and the nearer gap', () => {
        const rows = [
            { key: 'a', top: 0, right: 200, bottom: 32, left: 0 },
            { key: 'b', top: 40, right: 200, bottom: 72, left: 0 },
            { key: 'c', top: 80, right: 200, bottom: 112, left: 0 },
        ];

        expect(dropTargetRowKey(rows, 10, 60)).toBe('b');
        expect(dropTargetRowKey(rows, 10, 41)).toBe('b');
        expect(dropTargetRowKey(rows, 10, 37)).toBe('b');
        expect(dropTargetRowKey(rows, 10, 34)).toBe('a');
        expect(dropTargetRowKey([], 10, 60)).toBeNull();
    });

    it('lists only the accepted types on the zone line', () => {
        expect(formatDropzoneLimits({ 'image/png': ['.png'], 'image/jpeg': ['.jpg'] })).toBe('PNG, JPG');
        expect(formatDropzoneLimits({ 'application/pdf': [] })).toBe('PDF');
        expect(formatDropzoneLimits(undefined)).toBe('');
    });

    it('does not add a file that no longer fits maxTotalSize and reports the name and the room left', () => {
        const big = new File(['123456'], 'big.txt', { type: 'text/plain' });
        const result = takeIncomingFiles([{ ...item('a', 'a.txt'), size: 3 }], [big], [], {
            maxTotalSize: 8,
            createId: () => 'big',
        });

        expect(result.added).toEqual([]);
        expect(result.codes).toEqual([DROPZONE_REJECT.totalSize]);
        expect(result.rejections).toEqual([{ name: 'big.txt', code: DROPZONE_REJECT.totalSize, left: 5 }]);
    });

    it('accepts a file that exactly fills maxTotalSize', () => {
        const exact = new File(['12345'], 'exact.txt', { type: 'text/plain' });
        const result = takeIncomingFiles([{ ...item('a', 'a.txt'), size: 3 }], [exact], [], {
            maxTotalSize: 8,
            createId: () => 'exact',
        });

        expect(result.added.map(entry => entry.name)).toEqual(['exact.txt']);
        expect(result.rejections).toEqual([]);
    });

    it('spends the room of maxTotalSize in batch order', () => {
        const result = takeIncomingFiles(
            [],
            [
                new File(['123'], 'a.txt', { type: 'text/plain' }),
                new File(['456'], 'b.txt', { type: 'text/plain' }),
                new File(['7'], 'c.txt', { type: 'text/plain' }),
            ],
            [],
            { maxTotalSize: 4, createId: () => crypto.randomUUID() }
        );

        expect(result.added.map(entry => entry.name)).toEqual(['a.txt', 'c.txt']);
        expect(result.rejections).toEqual([{ name: 'b.txt', code: DROPZONE_REJECT.totalSize, left: 1 }]);
    });

    it('records a per-file rejection for every refusal reason', () => {
        const result = takeIncomingFiles(
            [item('a', 'a.txt')],
            [file('a.txt'), file('b.txt'), file('c.txt')],
            [{ file: file('big.txt'), codes: [DROPZONE_REJECT.tooBig] }],
            { maxFiles: 2, createId: () => crypto.randomUUID() }
        );

        expect(result.rejections).toEqual([
            { name: 'a.txt', code: DROPZONE_REJECT.duplicate },
            { name: 'c.txt', code: DROPZONE_REJECT.tooMany },
            { name: 'big.txt', code: DROPZONE_REJECT.tooBig },
        ]);
    });

    it('puts the fuller of the count and byte limits on a 0–100 meter', () => {
        const quota = dropzoneQuota({
            maxFiles: 4,
            maxTotalSize: 100,
            count: 2,
            bytes: 20,
            countTemplate: '{count} из {max}',
            bytesTemplate: '{size} из {max}',
            units: { byte: '{size} B', kilobyte: '{size} KB', megabyte: '{size} MB' },
        });

        expect(quota.text).toBe('2 из 4 · 20 B из 100 B');
        expect(quota.ratio).toBe(0.5);
        expect(quota.now).toBe(50);
        expect(quota.max).toBe(100);
    });

    it('caps the meter when the file count is full before the byte limit', () => {
        const quota = dropzoneQuota({
            maxFiles: 2,
            maxTotalSize: 10000,
            count: 2,
            bytes: 20,
            countTemplate: '{count} из {max}',
            bytesTemplate: '{size} из {max}',
            units: { byte: '{size} B', kilobyte: '{size} KB', megabyte: '{size} MB' },
        });

        expect(quota.now).toBe(100);
        expect(quota.ratio).toBe(1);
    });

    it('returns an empty quota when neither limit is set', () => {
        const quota = dropzoneQuota({
            count: 1,
            bytes: 10,
            countTemplate: '{count} из {max}',
            bytesTemplate: '{size} из {max}',
            units: { byte: '{size} B', kilobyte: '{size} KB', megabyte: '{size} MB' },
        });

        expect(quota.text).toBe('');
        expect(quota.ratio).toBe(0);
        expect(quota.now).toBe(0);
    });
});
