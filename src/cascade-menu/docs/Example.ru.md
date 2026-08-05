## Пример

```tsx
import { useState } from 'react';

import { Avatar } from '@ensi-platform/admin-ui/avatar';
import { CascadeMenu } from '@ensi-platform/admin-ui/cascade-menu';
import { Cart, ChevronDown, LogoEnsiMark, Package, Users } from '@ensi-platform/admin-ui/icons';
import { Popover } from '@ensi-platform/admin-ui/popover';

const items = [
    {
        text: 'Products',
        code: 'products',
        icon: Package,
        children: [
            { text: 'Catalog', code: 'products_catalog', link: '#/products/catalog' },
            { text: 'Import', code: 'products_import', link: '#/products/import' },
            {
                text: 'Directories',
                code: 'products_directories',
                children: [
                    { text: 'Attributes', code: 'products_attributes', link: '#/products/attributes' },
                    { text: 'Statuses', code: 'products_statuses', link: '#/products/statuses' },
                ],
            },
        ],
    },
    {
        text: 'Orders',
        code: 'orders',
        icon: Cart,
        children: [{ text: 'List', code: 'orders_list', link: '#/orders/list' }],
    },
    {
        text: 'Customers',
        code: 'customers',
        icon: Users,
        children: [
            { text: 'List', code: 'customers_list', link: '#/customers/list' },
            {
                text: 'Entities',
                code: 'customers_entities',
                children: [
                    {
                        text: 'Delete requests',
                        code: 'customers_delete',
                        link: '#/customers/deleting',
                    },
                ],
            },
        ],
    },
];

const [activePath, setActivePath] = useState('#/products/catalog');
const [collapsed, setCollapsed] = useState(false);
const [width, setWidth] = useState(280);

<div style={{ display: 'flex', minHeight: 480 }}>
    <CascadeMenu
        header={
            collapsed ? (
                <LogoEnsiMark width={28} height={28} title="ensi-opensource" />
            ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <LogoEnsiMark width={28} height={28} aria-hidden />
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>ensi-opensource</span>
                </span>
            )
        }
        items={items}
        pinUserId="demo-user"
        activePath={activePath}
        onChange={code => {
            // Найти link пункта по code и записать в activePath
            setActivePath(/* link */);
        }}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        width={width}
        onWidthChange={setWidth}
        footer={
            <Popover>
                <Popover.Trigger>
                    <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                        <Avatar name="Алекс С." initials="АС" size="md" />
                        {collapsed ? null : (
                            <>
                                <span style={{ flex: 1, textAlign: 'left' }}>
                                    <span style={{ display: 'block' }}>Алекс С.</span>
                                    <span style={{ display: 'block', opacity: 0.7 }}>Админ</span>
                                </span>
                                <ChevronDown />
                            </>
                        )}
                    </button>
                </Popover.Trigger>
                <Popover.Content placement="top start">
                    <button type="button">Выйти</button>
                </Popover.Content>
            </Popover>
        }
    />
    <main style={{ flex: 1, padding: 24 }}>Контент</main>
</div>
```
