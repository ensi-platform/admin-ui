import { type ElementType } from 'react';

import cn from 'classnames';

import { typographyStyles } from '@ds/typography';

import { linkVariants } from './theme';
import { type TLinkProps } from './types';

export const Link = <P extends ElementType = 'a'>({
    as,
    children,
    className,
    dataTestId,
    typography,
    ...props
}: TLinkProps<P>) => {
    const Component = as ?? 'a';

    return (
        <Component
            className={cn(linkVariants({ variant: 'primary' }), typographyStyles[typography ?? 'bodyS'], className)}
            data-test-id={dataTestId}
            {...props}
        >
            {children}
        </Component>
    );
};
