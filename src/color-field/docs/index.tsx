import { ColorField } from '../Component';
import { type IColorFieldProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const ColorFieldStoryComponent = (props: IColorFieldProps) => <ColorField {...props} />;

ColorFieldStoryComponent.displayName = 'ColorField';
