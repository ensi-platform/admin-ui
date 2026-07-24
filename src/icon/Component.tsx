import { type CSSProperties } from 'react';

import cn from 'classnames';

import { toCssSize } from '@ds/common/utils';

import { type IIconButtonProps } from './types';

import styles from './styles.module.css';

export const Icon = ({ Component, size, fill, className }: IIconButtonProps) => {
    const style = {
        ...(size !== undefined && { '--icon-size': toCssSize(size) }),
        ...(fill !== undefined && { '--icon-fill': fill }),
    } as CSSProperties;

    return <Component className={cn(styles.root, className)} style={style} aria-hidden focusable={false} />;
};
