import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminUiProvider, useAuiDirection, useAuiLabels, useAuiLocale } from '..';

const LabelsProbe = () => {
    const { clear } = useAuiLabels();

    return <span data-test-id="labels">{clear}</span>;
};

const LocaleProbe = () => {
    const locale = useAuiLocale();

    return <span data-test-id="locale">{locale}</span>;
};

const DirectionProbe = () => {
    const direction = useAuiDirection();

    return <span data-test-id="direction">{direction}</span>;
};

describe('AdminUiProvider', () => {
    it('exposes labels, locale and direction', () => {
        render(
            <AdminUiProvider locale="en-US" direction="rtl" labels={{ clear: 'Clear' }}>
                <LabelsProbe />
                <LocaleProbe />
                <DirectionProbe />
            </AdminUiProvider>
        );

        expect(screen.getByTestId('labels')).toHaveTextContent('Clear');
        expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
        expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    });

    it('throws useAuiLabels outside provider', () => {
        expect(() => render(<LabelsProbe />)).toThrow(
            'AdminUiProvider is required. Wrap the app with <AdminUiProvider>.'
        );
    });
});
