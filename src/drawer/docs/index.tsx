import { Drawer } from '../Component';
import { type IDrawerProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const DrawerStoryComponent = (props: IDrawerProps) => <Drawer {...props} />;

DrawerStoryComponent.displayName = 'Drawer';
