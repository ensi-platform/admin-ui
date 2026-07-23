import { Switch } from '../Component.js';
import { type ISwitchProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const SwitchStoryComponent = (props: ISwitchProps) => <Switch {...props} />;

SwitchStoryComponent.displayName = 'Switch';
