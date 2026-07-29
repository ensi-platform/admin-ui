import { type CSSProperties } from 'react';

import cn from 'classnames';
import {
    Text,
    type QueuedToast,
    UNSTABLE_Toast as RacToast,
    UNSTABLE_ToastContent as RacToastContent,
} from 'react-aria-components';

import { typographyStyles } from '@ds/typography';

import styles from '../../styles.module.css';
import { toastVariants } from '../../theme';
import { type IToastContent } from '../../types';
import { useToast } from '../../useToast';
import { CloseButton } from '../CloseButton';

interface IToastItemProps {
    toast: QueuedToast<IToastContent>;
}

export const ToastItem = ({ toast }: IToastItemProps) => {
    const { closeToast } = useToast();
    const { title, description, variant = 'neutral' } = toast.content;

    return (
        <RacToast
            toast={toast}
            className={toastVariants({ variant })}
            style={{ viewTransitionName: toast.key } as CSSProperties}
        >
            <RacToastContent className={styles.content}>
                <Text slot="title" className={cn(typographyStyles.bodyS, styles.title)}>
                    {title}
                </Text>
                {description ? (
                    <Text slot="description" className={cn(typographyStyles.bodyXs, styles.description)}>
                        {description}
                    </Text>
                ) : null}
            </RacToastContent>
            <CloseButton onClose={() => closeToast(toast.key)} />
        </RacToast>
    );
};

ToastItem.displayName = 'Toast.Item';
