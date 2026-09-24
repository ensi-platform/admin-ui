import { type ReactElement, type ReactNode } from 'react';

import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react/pure';

import { AdminUiProvider } from '@/provider';

export * from '@testing-library/react/pure';

/** Default render: every tree sits under AdminUiProvider (portal + labels). */
export const render = (ui: ReactElement, options?: RenderOptions): RenderResult => {
    const { wrapper: UserWrapper, ...rest } = options ?? {};

    const Wrapper = ({ children }: { children: ReactNode }) => (
        <AdminUiProvider>{UserWrapper ? <UserWrapper>{children}</UserWrapper> : children}</AdminUiProvider>
    );

    return rtlRender(ui, { ...rest, wrapper: Wrapper });
};
