import { Rating } from '../Component';
import { type IRatingProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const RatingStoryComponent = (props: IRatingProps) => <Rating {...props} />;

RatingStoryComponent.displayName = 'Rating';
