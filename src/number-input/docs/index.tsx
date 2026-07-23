import { NumberInput } from '../Component.js';
import { type INumberInputProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const NumberInputStoryComponent = (props: INumberInputProps) => <NumberInput {...props} />;

NumberInputStoryComponent.displayName = 'NumberInput';
