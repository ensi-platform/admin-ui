import { Badge } from '../Component';
import { type IBadgeProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const BadgeStoryComponent = (props: IBadgeProps) => <Badge {...props} />;

BadgeStoryComponent.displayName = 'Badge';
