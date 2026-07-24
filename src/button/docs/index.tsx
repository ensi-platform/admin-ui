import { Button } from '../Component';
import { type TButtonProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const ButtonStoryComponent = (props: TButtonProps) => <Button {...props} />;

ButtonStoryComponent.displayName = 'Button';
