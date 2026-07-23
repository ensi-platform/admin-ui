import { Select } from '../Component.js';
import { type ISelectProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const SelectStoryComponent = (props: ISelectProps) => <Select {...props} />;

SelectStoryComponent.displayName = 'Select';
