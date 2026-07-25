import { ActionPopup } from '../Component';
import { ConfirmModal } from '../ConfirmModal';
import { DeleteModal } from '../DeleteModal';
import { type IActionPopupProps, type TConfirmModalProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const ActionPopupStoryComponent = (props: IActionPopupProps) => <ActionPopup {...props} />;

ActionPopupStoryComponent.displayName = 'ActionPopup';

/** Story wrapper for react-docgen-typescript. */
export const ConfirmModalStoryComponent = (props: TConfirmModalProps) => <ConfirmModal {...props} />;

ConfirmModalStoryComponent.displayName = 'ConfirmModal';

/** Story wrapper for react-docgen-typescript. */
export const DeleteModalStoryComponent = (props: TConfirmModalProps) => <DeleteModal {...props} />;

DeleteModalStoryComponent.displayName = 'DeleteModal';
