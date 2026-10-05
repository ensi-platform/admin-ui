import cn from 'classnames';
import { Tab as RacTab } from 'react-aria-components';

import { supportRef } from '@ds/common/support-ref';
import { typographyStyles } from '@ds/typography';

import { useVerticalTabs } from '../../context';
import { type IVerticalTabsItemProps } from '../../types';
import { VerticalTabsIndicator } from '../Indicator';

import { verticalTabsItemVariants } from './theme';

import styles from './styles.module.css';

const itemTypography = {
    sm: typographyStyles.bodyXs,
    md: typographyStyles.bodyS,
    lg: typographyStyles.bodyM,
} as const;

export const VerticalTabsItem = supportRef(
    ({ ref, id, children, disabled = false, className, dataTestId, ...props }: IVerticalTabsItemProps) => {
        const { size, variant } = useVerticalTabs();

        return (
            <RacTab
                {...props}
                ref={ref}
                id={id}
                isDisabled={disabled}
                className={cn(verticalTabsItemVariants({ size, variant }), itemTypography[size], className)}
                data-size={size}
                data-test-id={dataTestId}
            >
                <span className={styles.content}>{children}</span>
                <VerticalTabsIndicator />
            </RacTab>
        );
    }
);

VerticalTabsItem.displayName = 'VerticalTabs.Item';
