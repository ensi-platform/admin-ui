import cn from 'classnames';
import { Heading } from 'react-aria-components';

import { modalTitleVariants } from './theme';
import { type IModalTitleProps } from './types';

export const ModalTitle = ({ children, className, ...props }: IModalTitleProps) => (
    <Heading {...props} slot="title" level={2} className={cn(modalTitleVariants(), className)}>
        {children}
    </Heading>
);

ModalTitle.displayName = 'Modal.Title';
