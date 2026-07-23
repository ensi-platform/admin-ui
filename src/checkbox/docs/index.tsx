import { Checkbox } from '../Component.js';
import { type ICheckboxProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const CheckboxStoryComponent = (props: ICheckboxProps) => <Checkbox {...props} />;

CheckboxStoryComponent.displayName = 'Checkbox';
