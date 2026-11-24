import { Tree } from '../Component';
import { type ITreeProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TreeStoryComponent = (props: ITreeProps) => <Tree {...props} />;

TreeStoryComponent.displayName = 'Tree';
