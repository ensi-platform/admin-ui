import { Dropzone } from '../Component';
import { type IDropzoneProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const DropzoneStoryComponent = (props: IDropzoneProps) => <Dropzone {...props} />;

DropzoneStoryComponent.displayName = 'Dropzone';
