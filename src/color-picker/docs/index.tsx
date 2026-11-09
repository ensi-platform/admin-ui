import { ColorPicker } from '../Component';
import { type IColorPickerProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const ColorPickerStoryComponent = (props: IColorPickerProps) => <ColorPicker {...props} />;

ColorPickerStoryComponent.displayName = 'ColorPicker';
