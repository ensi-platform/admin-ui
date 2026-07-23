import { Button } from '../Component.js';
import { type TButtonProps } from '../types.js';

/** Обёртка без generic — чтобы react-docgen-typescript собрал таблицу пропов. */
export const ButtonStoryComponent = (props: TButtonProps) => <Button {...props} />;

ButtonStoryComponent.displayName = 'Button';
