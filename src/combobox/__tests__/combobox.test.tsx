import { describe, expect, it } from 'vitest';

import { ComboboxListStatus } from '../components/ListStatus';
import { resolveSelectedOptions } from '../utils';

describe('<Combobox>', () => {
    it('exports list status and utils', () => {
        expect(ComboboxListStatus).toBeTypeOf('function');
        expect(resolveSelectedOptions).toBeTypeOf('function');
    });
});
