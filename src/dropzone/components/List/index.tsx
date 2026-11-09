import { type IFileListProps } from '../../types';
import { FileRows } from '../FileRows';

/** Column of file rows. */
export const List = (props: IFileListProps) => <FileRows {...props} layout="list" />;

List.displayName = 'Dropzone.List';
