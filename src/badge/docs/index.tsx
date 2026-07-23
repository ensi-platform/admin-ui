import { Badge } from '../Component.js';
import { type IBadgeProps } from '../types.js';

/** Обёртка для react-docgen-typescript. */
export const BadgeStoryComponent = (props: IBadgeProps) => <Badge {...props} />;

BadgeStoryComponent.displayName = 'Badge';
