import { Tag } from '../Component.js';
import { type ITagProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const TagStoryComponent = (props: ITagProps) => <Tag {...props} />;

TagStoryComponent.displayName = 'Tag';
