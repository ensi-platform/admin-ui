import { type ElementType, type ReactNode } from 'react';

import { type TMergeElementProps, type TSVGRIcon } from '../common/index.js';

export type TSize = 'sm' | 'md' | 'lg';

export type TVariant = 'primary' | 'secondary' | 'tertiary';

export interface IIconButtonProps {
    /** SVG-компонент иконки (SVGR). */
    Component: TSVGRIcon;
    /** Рендерить иконку после текста. */
    after?: boolean;
    /** Отступ между иконкой и текстом. */
    indent?: number | string;
    /** Размер иконки. */
    size?: number | string;
    /** Дополнительный className иконки. */
    className?: string;
    /** Цвет заливки иконки. */
    fill?: string;
}

export interface IButtonBaseProps {
    /** Содержимое кнопки. */
    children: ReactNode;
    /** Размер кнопки. */
    size?: TSize;
    /** Визуальный вариант. */
    variant?: TVariant;
    /** Иконка слева или справа от текста. */
    icon?: IIconButtonProps;
    /** Дополнительный className корневого элемента. */
    className?: string;
    /** Значение атрибута `data-test-id`. */
    dataTestId?: string;
}

export type TButtonProps<P extends ElementType = 'button'> = {
    /** HTML-элемент или компонент-обёртка (по умолчанию `button`). */
    as?: P;
} & TMergeElementProps<P, IButtonBaseProps>;
