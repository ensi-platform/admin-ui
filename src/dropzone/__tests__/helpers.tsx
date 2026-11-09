import { type ReactElement, useState } from 'react';

import { type RenderResult, render, screen } from '@testing-library/react';

import { AdminUiProvider } from '@/provider';

import { Dropzone } from '..';
import { type IDropzoneFile } from '../types';

import type userEvent from '@testing-library/user-event';

export const prompt = 'Нажмите, чтобы загрузить, или перетащите файл';

export const textFile = (name: string, contents = 'hello') => new File([contents], name, { type: 'text/plain' });

export const imageFile = (name: string) => new File(['img'], name, { type: 'image/png' });

export const upload = async (user: ReturnType<typeof userEvent.setup>, file: File | File[]) => {
    await user.upload(screen.getByLabelText(prompt), file);
};

export const renderZone = (ui: ReactElement): RenderResult => render(<AdminUiProvider>{ui}</AdminUiProvider>);

export type TUploadFn = (
    file: File,
    options: { onProgress: (percent: number) => void; signal: AbortSignal }
) => Promise<{ id: string; url: string }>;

export const makeFiles = (names: string[], size = 1): IDropzoneFile[] =>
    names.map(name => ({ id: name, name, size, type: 'text/plain' }));

export const row = (name: string) => screen.getByRole('row', { name });

interface IHarnessProps {
    initial: IDropzoneFile[];
    onRemove?: (file: IDropzoneFile) => void;
    disabled?: boolean | { add?: boolean; remove?: boolean; reorder?: boolean };
}

export const Harness = ({ initial, onRemove, disabled }: IHarnessProps) => {
    const [files, setFiles] = useState(initial);

    return <Dropzone value={files} onChange={setFiles} onRemove={onRemove} disabled={disabled} />;
};

interface IReviewHarnessProps {
    initial: IDropzoneFile[];
    maxFiles?: number;
    onRemove?: (file: IDropzoneFile) => void;
    renderAction?: (file: IDropzoneFile) => ReactElement;
}

export const ReviewHarness = ({ initial, maxFiles, onRemove, renderAction }: IReviewHarnessProps) => {
    const [files, setFiles] = useState(initial);

    return (
        <Dropzone
            value={files}
            onChange={setFiles}
            onRemove={onRemove}
            maxFiles={maxFiles}
            renderAction={renderAction}
        />
    );
};
