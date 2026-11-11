import { Password } from '../Component';
import { type IPasswordProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const PasswordStoryComponent = (props: IPasswordProps) => <Password {...props} />;

PasswordStoryComponent.displayName = 'Password';
