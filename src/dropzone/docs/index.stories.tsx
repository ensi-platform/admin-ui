import { useEffect, useRef } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';
import { z } from 'zod';

import { Button } from '@/button';
import { Form } from '@/form';
import { Download } from '@/icons';

import { Dropzone } from '..';
import { FormDropzone } from '../FormDropzone';
import { type IDropzoneFile, type IDropzoneProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { DropzoneStoryComponent } from '.';

const imageUrl =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect width=%2248%22 height=%2248%22 fill=%22%23ddd%22/%3E%3C/svg%3E';

const manyFiles: IDropzoneFile[] = Array.from({ length: 12 }, (_, index) => ({
    id: `file-${index + 1}`,
    name: `attachment-${index + 1}.pdf`,
    size: 2048 * (index + 1),
    type: 'application/pdf',
}));

const manyImages: IDropzoneFile[] = Array.from({ length: 8 }, (_, index) => ({
    id: `image-${index + 1}`,
    name: `photo-${index + 1}.png`,
    size: 4096,
    type: 'image/png',
    url: imageUrl,
}));
const createdUrls: string[] = [];

const uploadLater: IDropzoneProps['upload'] = file =>
    new Promise(resolve => {
        window.setTimeout(() => {
            const url = URL.createObjectURL(file);

            createdUrls.push(url);
            resolve({ id: file.name, url });
        }, 1200);
    });

const UploadStory = () => {
    useEffect(
        () => () => {
            createdUrls.forEach(url => {
                URL.revokeObjectURL(url);
            });
            createdUrls.length = 0;
        },
        []
    );

    return (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="Upload" upload={uploadLater} />
        </div>
    );
};

const files: IDropzoneFile[] = [
    { id: 'brief', name: 'brief.pdf', size: 2048, type: 'application/pdf' },
    { id: 'notes', name: 'notes.txt', size: 512, type: 'text/plain' },
];

const DEFAULT_ARGS: IDropzoneProps = {
    size: 'md',
    disabled: false,
    invalid: false,
    loading: false,
    paste: false,
    layout: 'list',
    title: 'Attachments',
    description: 'PDF and text',
    defaultValue: files,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IDropzoneProps>> = {
    size: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    paste: { control: { type: 'boolean' } },
    layout: { control: { type: 'select' } },
};

export default {
    title: 'Form/Dropzone',
    component: DropzoneStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        docsCssVariables,
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof DropzoneStoryComponent>;

export const Default: StoryObj<IDropzoneProps> = {
    render: args => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent {...args} />
        </div>
    ),
};

export const Sizes: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="sm" size="sm" defaultValue={files} />
            <DropzoneStoryComponent aria-label="md" size="md" defaultValue={files} />
            <DropzoneStoryComponent aria-label="lg" size="lg" defaultValue={files} />
        </div>
    ),
};

export const Disabled: StoryObj<IDropzoneProps> = {
    args: {
        disabled: true,
    },
    render: Default.render,
};

export const Loading: StoryObj<IDropzoneProps> = {
    args: {
        loading: true,
    },
    render: Default.render,
};

export const Images: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Images"
                layout="grid"
                accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg'] }}
                defaultValue={[
                    {
                        id: 'cover',
                        name: 'cover.png',
                        size: 4096,
                        type: 'image/png',
                        url: imageUrl,
                    },
                ]}
            />
        </div>
    ),
};

export const CustomHint: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Cover"
                accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg'] }}
                maxSize={1024 * 1024}
                hint="At least 800×600"
            />
        </div>
    ),
};

export const ManyFiles: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Attachments"
                defaultValue={manyFiles}
                maxFiles={20}
                maxSize={5 * 1024 * 1024}
            />
        </div>
    ),
};

export const ManyImages: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Images"
                accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg'] }}
                layout="grid"
                defaultValue={manyImages}
                maxFiles={12}
                maxSize={5 * 1024 * 1024}
            />
        </div>
    ),
};

export const BrokenImage: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Broken image"
                layout="grid"
                defaultValue={[
                    {
                        id: 'cover',
                        name: 'cover.png',
                        size: 4096,
                        type: 'image/png',
                        url: '/missing-cover.png',
                    },
                ]}
            />
        </div>
    ),
};

export const Grid: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="Grid" layout="grid" defaultValue={manyImages} maxFiles={12} />
        </div>
    ),
};

export const Quota: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Quota"
                defaultValue={manyFiles}
                maxFiles={20}
                maxTotalSize={25 * 1024 * 1024}
                maxSize={10 * 1024 * 1024}
            />
        </div>
    ),
};

export const SingleSlot: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="Replace" maxFiles={1} defaultValue={[files[0]!]} />
        </div>
    ),
};

const holdUpload: IDropzoneProps['upload'] = (_file, { onProgress }) =>
    new Promise(() => {
        onProgress(42);
    });

const UploadingDemo = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const input = rootRef.current?.querySelector<HTMLInputElement>('input[type="file"]');

        if (!input) {
            return;
        }

        const transfer = new DataTransfer();

        transfer.items.add(new File(['video'], 'rough-cut.mov', { type: 'video/quicktime' }));
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }, []);

    return (
        <div ref={rootRef} style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="Uploading" defaultValue={[files[0]!]} upload={holdUpload} />
        </div>
    );
};

export const WithUpload: StoryObj<IDropzoneProps> = {
    render: () => <UploadStory />,
};

export const Uploading: StoryObj<IDropzoneProps> = {
    render: () => <UploadingDemo />,
};

const failUpload: IDropzoneProps['upload'] = () => Promise.reject(new Error('The server rejected this file'));

const UploadErrorDemo = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const input = rootRef.current?.querySelector<HTMLInputElement>('input[type="file"]');

        if (!input) {
            return;
        }

        const transfer = new DataTransfer();

        transfer.items.add(new File(['broken'], 'rough-cut.mov', { type: 'video/quicktime' }));
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }, []);

    return (
        <div ref={rootRef} style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent aria-label="Upload error" defaultValue={[files[0]!]} upload={failUpload} />
        </div>
    );
};

export const UploadError: StoryObj<IDropzoneProps> = {
    render: () => <UploadErrorDemo />,
};

export const WithDownload: StoryObj<IDropzoneProps> = {
    render: () => (
        <div style={{ maxWidth: 420 }}>
            <DropzoneStoryComponent
                aria-label="Attachments"
                defaultValue={files}
                renderAction={file => (
                    <Dropzone.Action hidden icon={Download} onClick={() => undefined}>
                        {`Download ${file.name}`}
                    </Dropzone.Action>
                )}
            />
        </div>
    ),
};

export const WithForm: StoryObj = {
    render: () => (
        <Form
            initialValues={{ files: [] as IDropzoneFile[] }}
            validationSchema={z.object({
                files: z.array(z.custom<IDropzoneFile>()).min(1, 'Add a file'),
            })}
            onSubmit={() => undefined}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
                <FormDropzone
                    name="files"
                    label="Attachments"
                    hint="PDF, up to 5 MB"
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxSize={5 * 1024 * 1024}
                />
                <Button type="submit">Save</Button>
            </div>
        </Form>
    ),
};
