import { Select } from '../Component';
import { type ISelectProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const SelectStoryComponent = (props: ISelectProps) => <Select {...props} />;

SelectStoryComponent.displayName = 'Select';
