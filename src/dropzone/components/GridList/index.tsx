import { type IFileListProps } from '../../types';
import { FileRows } from '../FileRows';

/** Grid of file cards. */
export const GridList = (props: IFileListProps) => <FileRows {...props} layout="grid" />;

GridList.displayName = 'Dropzone.GridList';
