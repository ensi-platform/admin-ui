import { type Accept, type FileRejection } from 'react-dropzone';

import { type IDropzoneFile, type IPendingDropzoneFile } from './types';

export const DROPZONE_REJECT = {
    tooBig: 'file-too-large',
    badType: 'file-invalid-type',
    tooMany: 'too-many-files',
    nameLength: 'name-too-long',
    duplicate: 'duplicate',
    totalSize: 'total-size',
    custom: 'custom',
} as const;

const KB = 1024;

/** Id for a new file. `randomUUID` throws outside a secure context. */
export const createDropzoneId = () => {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch {
        // http hosts have no secure context
    }

    return `dz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

/** Which dropzone actions a `disabled` value turns off. */
export const dropzoneBlocks = (disabled?: boolean | { add?: boolean; remove?: boolean; reorder?: boolean }) => {
    const all = disabled === true;
    const flags = typeof disabled === 'object' && disabled ? disabled : {};

    return {
        all,
        add: all || flags.add === true,
        remove: all || flags.remove === true,
        reorder: all || flags.reorder === true,
    };
};

/** Text from a rejected upload. Empty and non-strings become no message. */
export const uploadError = (reason: unknown) => {
    const text = reason instanceof Error ? reason.message : reason;

    if (typeof text !== 'string') {
        return undefined;
    }

    const trimmed = text.trim();

    return trimmed || undefined;
};

/** Settled files plus uploads still in flight. */
export const occupiedFrom = (
    files: readonly IDropzoneFile[],
    pending: readonly IPendingDropzoneFile[]
): IDropzoneFile[] => [
    ...files,
    ...pending.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        type: item.type,
    })),
];

/** Replaces `{name}` placeholders in a label template. */
export const fillLabel = (template: string, values: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

/** Zone instruction from drag, replace, and the file limit. */
export const dropzoneZoneText = ({
    dragging,
    maxFiles,
    currentName,
    limitReached,
    occupied,
    replacingSlot,
    prompt,
    replace,
    replaceDrop,
    limit,
}: {
    dragging: boolean;
    maxFiles?: number;
    currentName?: string;
    limitReached: boolean;
    occupied: number;
    replacingSlot: boolean;
    prompt: string;
    replace: string;
    replaceDrop: string;
    limit: string;
}) => {
    if (dragging && maxFiles === 1 && currentName) {
        return fillLabel(replaceDrop, { name: currentName });
    }

    if (limitReached && maxFiles != null) {
        return fillLabel(limit, { count: occupied, max: maxFiles });
    }

    if (replacingSlot) {
        return replace;
    }

    return prompt;
};

/** Label templates for a formatted size. `{size}` is the number. */
export interface IFileSizeUnits {
    byte: string;
    kilobyte: string;
    megabyte: string;
}

const sizeNumber = (value: number) => {
    const rounded = Math.round(value * 10) / 10;

    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

/** Human size. Units come from labels. Values stay in the real unit. */
export const formatFileSize = (size: number, units: IFileSizeUnits) => {
    if (size < KB) {
        return fillLabel(units.byte, { size: Math.max(0, Math.round(size)) });
    }

    if (size < KB * KB) {
        return fillLabel(units.kilobyte, { size: sizeNumber(size / KB) });
    }

    return fillLabel(units.megabyte, { size: sizeNumber(size / (KB * KB)) });
};

/** Units for `formatFileSize` from dropzone labels. */
export const fileSizeUnitsFrom = (labels: {
    dropzoneByte: string;
    dropzoneKilobyte: string;
    dropzoneMegabyte: string;
}): IFileSizeUnits => ({
    byte: labels.dropzoneByte,
    kilobyte: labels.dropzoneKilobyte,
    megabyte: labels.dropzoneMegabyte,
});

export interface IIncomingRejection {
    file: File;
    codes: readonly string[];
}

export interface IFileRefusal {
    name: string;
    code: string;
    /** Bytes still free when `code` is `total-size`. */
    left?: number;
    /** Caller reason when `code` is `custom`. */
    message?: string;
}

export interface ITakeIncomingFilesOptions {
    maxFiles?: number;
    maxTotalSize?: number;
    createId?: () => string;
}

export interface ITakeIncomingFilesResult {
    added: IDropzoneFile[];
    codes: string[];
    rejections: IFileRefusal[];
}

/** A duplicate is the same file name, including a file that already lives on the server. */
export const takeIncomingFiles = (
    existing: readonly IDropzoneFile[],
    accepted: readonly File[],
    rejected: readonly IIncomingRejection[],
    options: ITakeIncomingFilesOptions = {}
): ITakeIncomingFilesResult => {
    const names = new Set(existing.map(file => file.name));
    const createId = options.createId ?? createDropzoneId;
    const room = options.maxFiles == null ? Number.POSITIVE_INFINITY : Math.max(0, options.maxFiles - existing.length);
    let used = existing.reduce((sum, file) => sum + file.size, 0);
    const added: IDropzoneFile[] = [];
    const codes: string[] = [];
    const rejections: IFileRefusal[] = [];
    const refuse = (name: string, code: string, left?: number) => {
        codes.push(code);
        rejections.push({ name, code, left });
    };

    accepted.forEach(file => {
        if (names.has(file.name)) {
            refuse(file.name, DROPZONE_REJECT.duplicate);
            return;
        }

        if (added.length >= room) {
            refuse(file.name, DROPZONE_REJECT.tooMany);
            return;
        }

        if (options.maxTotalSize != null && used + file.size > options.maxTotalSize) {
            refuse(file.name, DROPZONE_REJECT.totalSize, Math.max(0, options.maxTotalSize - used));
            return;
        }

        names.add(file.name);
        used += file.size;
        added.push({
            id: createId(),
            name: file.name,
            size: file.size,
            type: file.type,
            file,
        });
    });

    rejected.forEach(item => {
        item.codes.forEach(code => {
            refuse(item.file.name, code);
        });
    });

    return { added, codes, rejections };
};

/** Maps react-dropzone rejections to codes our copy understands. */
export const rejectionCodes = (rejections: readonly FileRejection[]): IIncomingRejection[] =>
    rejections.map(rejection => ({
        file: rejection.file,
        codes: rejection.errors.map(error => error.code),
    }));

export interface IDropzoneRowBox {
    key: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

const axisDistance = (value: number, start: number, end: number) => value - Math.min(end, Math.max(start, value));

/** The row under the point. A gap belongs to the nearer row, and the whole row is one target. */
export const dropTargetRowKey = (rows: readonly IDropzoneRowBox[], x: number, y: number) => {
    if (rows.length === 0) {
        return null;
    }

    const distance = (row: IDropzoneRowBox) => {
        const dx = axisDistance(x, row.left, row.right);
        const dy = axisDistance(y, row.top, row.bottom);

        return dx * dx + dy * dy;
    };
    const inside = rows.filter(row => x >= row.left && x <= row.right && y >= row.top && y <= row.bottom);
    const pool = inside.length > 0 ? inside : rows;

    return pool.reduce((best, row) => (distance(row) < distance(best) ? row : best)).key;
};

/** Puts `keys` on the target row's index. Moving down lands after it, moving up before it. */
export const moveDropzoneFiles = (files: readonly IDropzoneFile[], keys: readonly string[], targetKey: string) => {
    const moving = new Set(keys);

    if (keys.length === 0 || moving.has(targetKey)) {
        return [...files];
    }

    const from = files.findIndex(file => moving.has(file.id));
    const targetIndex = files.findIndex(file => file.id === targetKey);

    if (from < 0 || targetIndex < 0) {
        return [...files];
    }

    const moved = files.filter(file => moving.has(file.id));
    const rest = files.filter(file => !moving.has(file.id));
    const indexInRest = rest.findIndex(file => file.id === targetKey);
    const insertAt = from < targetIndex ? indexInRest + 1 : indexInRest;

    return [...rest.slice(0, insertAt), ...moved, ...rest.slice(insertAt)];
};

/** Moves `keys` before or after `targetKey`. A drop onto the dragged id is a no-op. */
export const reorderDropzoneFiles = (
    files: readonly IDropzoneFile[],
    keys: readonly string[],
    targetKey: string,
    position: 'before' | 'after' | 'on'
) => {
    if (position === 'on') {
        return [...files];
    }

    const moving = new Set(keys);
    const moved = files.filter(file => moving.has(file.id));
    const rest = files.filter(file => !moving.has(file.id));
    const index = rest.findIndex(file => file.id === targetKey);

    if (index < 0 || moved.length === 0) {
        return [...files];
    }

    const insertAt = position === 'before' ? index : index + 1;

    return [...rest.slice(0, insertAt), ...moved, ...rest.slice(insertAt)];
};

const extensionLabel = (extension: string) => extension.replace(/^\./, '').toUpperCase();

const mimeLabel = (mime: string) => {
    const subtype = mime.split('/')[1] ?? mime;

    return subtype.replace(/[^a-z0-9]/gi, '').toUpperCase() || mime.toUpperCase();
};

export interface IDropzoneQuotaInput {
    maxFiles?: number;
    maxTotalSize?: number;
    count: number;
    bytes: number;
    /** `{count}` used, `{max}` allowed. */
    countTemplate: string;
    /** `{size}` used, `{max}` allowed. Both are formatted. */
    bytesTemplate: string;
    /** Byte, kilobyte, and megabyte templates. */
    units: IFileSizeUnits;
}

export interface IDropzoneQuota {
    /** Joined quota line. Empty when neither limit is set. */
    text: string;
    /** Fill from 0 to 1. The fuller limit wins. */
    ratio: number;
    /** Meter value on a 0–100 scale. */
    now: number;
    /** Meter max. 100 when a limit is set. */
    max: number;
}

/** Quota line and a 0–100 meter. The fuller of the count and byte limits wins. */
export const dropzoneQuota = ({
    maxFiles,
    maxTotalSize,
    count,
    bytes,
    countTemplate,
    bytesTemplate,
    units,
}: IDropzoneQuotaInput): IDropzoneQuota => {
    const countRatio = maxFiles != null && maxFiles > 0 ? count / maxFiles : 0;
    const byteRatio = maxTotalSize != null && maxTotalSize > 0 ? bytes / maxTotalSize : 0;
    const ratio = Math.min(1, Math.max(countRatio, byteRatio));
    const text = [
        maxFiles != null ? fillLabel(countTemplate, { count, max: maxFiles }) : '',
        maxTotalSize != null
            ? fillLabel(bytesTemplate, { size: formatFileSize(bytes, units), max: formatFileSize(maxTotalSize, units) })
            : '',
    ]
        .filter(Boolean)
        .join(' · ');
    const limited = maxFiles != null || maxTotalSize != null;

    return {
        text,
        ratio,
        now: limited ? Math.round(ratio * 100) : 0,
        max: 100,
    };
};

/** Accepted type names for the zone. Size and count live on the quota line. */
export const formatDropzoneLimits = (accept: Accept | undefined) => {
    const types = accept
        ? Object.entries(accept).flatMap(([mime, extensions]) =>
              extensions.length > 0 ? [extensions].flat().map(extensionLabel) : [mimeLabel(mime)]
          )
        : [];
    return [...new Set(types)].join(', ');
};
