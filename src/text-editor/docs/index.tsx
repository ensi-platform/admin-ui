import { TextEditor } from '../Component';
import { type ITextEditorProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const TextEditorStoryComponent = (props: ITextEditorProps) => <TextEditor {...props} />;

TextEditorStoryComponent.displayName = 'TextEditor';
