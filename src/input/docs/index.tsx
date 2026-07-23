import { Input } from '../Component.js';
import { type IInputProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const InputStoryComponent = (props: IInputProps) => <Input {...props} />;

InputStoryComponent.displayName = 'Input';
