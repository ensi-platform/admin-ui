import { TimeField } from '../Component';
import { type ITimeFieldProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TimeFieldStoryComponent = (props: ITimeFieldProps) => <TimeField {...props} />;

TimeFieldStoryComponent.displayName = 'TimeField';
