import { Modal } from '../Component';
import { type IModalProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const ModalStoryComponent = (props: IModalProps) => <Modal {...props} />;

ModalStoryComponent.displayName = 'Modal';
