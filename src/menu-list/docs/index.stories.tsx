import { useState, type SVGProps } from 'react';

import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { MenuList } from '../Component';
import { type IMenuListProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TMenuListStoryProps = Omit<IMenuListProps, 'children' | 'value' | 'onChange'>;

const BagIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
        <path
            d="M4.5 5.5V4a3.5 3.5 0 0 1 7 0v1.5M3 5.5h10l-.6 7.2A1.5 1.5 0 0 1 10.9 14H5.1a1.5 1.5 0 0 1-1.5-1.3L3 5.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
        />
    </svg>
);

const DEFAULT_ARGS: TMenuListStoryProps = {
    size: 'md',
    variant: 'primary',
    disabled: false,
    collapsed: false,
    defaultValue: 'orders',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TMenuListStoryProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    disabled: { control: { type: 'boolean' } },
    collapsed: { control: { type: 'boolean' } },
};

const MenuListDemo = (props: TMenuListStoryProps) => {
    const [active, setActive] = useState(props.defaultValue ?? 'orders');

    return (
        <div style={{ width: props.collapsed ? 64 : 280 }}>
            <MenuList {...props} value={active} onChange={setActive}>
                <MenuList.Group label="SALES">
                    <MenuList.Item id="orders" href="#orders" icon={BagIcon}>
                        Orders
                    </MenuList.Item>
                    <MenuList.Item id="clients" href="#clients" icon={BagIcon}>
                        Clients
                    </MenuList.Item>
                </MenuList.Group>
                <MenuList.Group label="SETTINGS">
                    <MenuList.Item id="users" href="#users" icon={BagIcon}>
                        Users
                    </MenuList.Item>
                    <MenuList.Item id="settings" href="#settings" icon={BagIcon} disabled>
                        Settings
                    </MenuList.Item>
                </MenuList.Group>
            </MenuList>
        </div>
    );
};

MenuListDemo.displayName = 'MenuList';

export default {
    title: 'Base/MenuList',
    component: MenuListDemo,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        docsCssVariables,
        controls: {
            expanded: true,
        },
    },
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof MenuListDemo>;

export const Default: StoryObj<typeof MenuListDemo> = {};

export const Collapsed: StoryObj<typeof MenuListDemo> = {
    args: {
        collapsed: true,
    },
};
