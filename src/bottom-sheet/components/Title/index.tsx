import cn from 'classnames';
import { Heading } from 'react-aria-components';

import { bottomSheetTitleVariants } from './theme';
import { type IBottomSheetTitleProps } from './types';

export const BottomSheetTitle = ({ children, className, ...props }: IBottomSheetTitleProps) => (
    <Heading {...props} slot="title" level={2} className={cn(bottomSheetTitleVariants(), className)}>
        {children}
    </Heading>
);

BottomSheetTitle.displayName = 'BottomSheet.Title';
