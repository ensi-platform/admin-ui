import { Tag } from '../Component';
import { type ITagProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TagStoryComponent = (props: ITagProps) => <Tag {...props} />;

TagStoryComponent.displayName = 'Tag';
