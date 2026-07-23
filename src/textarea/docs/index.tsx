import { TextArea } from '../Component.js';
import { type ITextAreaProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const TextAreaStoryComponent = (props: ITextAreaProps) => <TextArea {...props} />;

TextAreaStoryComponent.displayName = 'TextArea';
