import { NumberRange } from '../Component';
import { type INumberRangeProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const NumberRangeStoryComponent = (props: INumberRangeProps) => <NumberRange {...props} />;

NumberRangeStoryComponent.displayName = 'NumberRange';
