import { Input } from '../Component';
import { type IInputProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const InputStoryComponent = (props: IInputProps) => <Input {...props} />;

InputStoryComponent.displayName = 'Input';
