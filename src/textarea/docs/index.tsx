import { TextArea } from '../Component';
import { type ITextAreaProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TextAreaStoryComponent = (props: ITextAreaProps) => <TextArea {...props} />;

TextAreaStoryComponent.displayName = 'TextArea';
