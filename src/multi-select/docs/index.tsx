import { MultiSelect } from '../Component.js';
import { type IMultiSelectProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const MultiSelectStoryComponent = (props: IMultiSelectProps) => <MultiSelect {...props} />;

MultiSelectStoryComponent.displayName = 'MultiSelect';
