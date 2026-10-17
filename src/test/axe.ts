import { expect } from 'vitest';
import { type axe as axeRunner, configureAxe } from 'vitest-axe';
// Public `vitest-axe/matchers` typings are type-only; the matcher value is in dist.
import { toHaveNoViolations } from 'vitest-axe/dist/matchers';

expect.extend({ toHaveNoViolations });

type TAxe = typeof axeRunner;

/**
 * axe with `color-contrast` and `region` off.
 * jsdom has no layout, and primitives are not page landmarks.
 */
export const axe: TAxe = configureAxe({
    rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false },
    },
});

declare global {
    // Vitest's `Assertion` extends global `jest.Matchers`. `declare module 'vitest'`
    // does not merge into that type: `Assertion` is only re-exported from `@vitest/expect`.
    // Names and the namespace are Jest's, not ours.
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface Matchers<R = void> {
            toHaveNoViolations(): R;
        }
    }
}
