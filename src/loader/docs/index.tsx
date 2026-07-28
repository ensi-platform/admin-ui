import { Loader } from '../Component';
import { type ILoaderProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const LoaderStoryComponent = (props: ILoaderProps) => <Loader {...props} />;

LoaderStoryComponent.displayName = 'Loader';
