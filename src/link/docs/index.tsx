import { Link } from '../Component';
import { type TLinkProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const LinkStoryComponent = (props: TLinkProps) => <Link {...props} />;

LinkStoryComponent.displayName = 'Link';
