interface IJsdomError extends Error {
    type?: string;
    cause?: { stack?: string };
}

interface IVirtualConsole {
    removeAllListeners: (event: string) => void;
    on: (event: string, listener: (error: IJsdomError) => void) => void;
}

interface IJsdomInstance {
    virtualConsole: IVirtualConsole;
}

const isExpectedContextError = (value: unknown) => {
    const text = value instanceof Error ? value.message : String(value ?? '');

    return (
        text.includes('must be used within') ||
        text.includes('is required') ||
        text.includes('requires CascadeMenu') ||
        text.includes('The above error occurred') ||
        text.includes('Consider adding an error boundary')
    );
};

const originalError = console.error.bind(console);

console.error = (...args: unknown[]) => {
    if (args.some(isExpectedContextError)) return;
    originalError(...args);
};

/** React DEV rethrows via a fake DOM event; jsdom prints unless default is prevented. */
window.addEventListener('error', event => {
    if (isExpectedContextError(event.error ?? event.message)) {
        event.preventDefault();
    }
});

/**
 * Default JSDOM VirtualConsole forwards before setupFiles can patch console.
 * Drop `not-implemented` (e.g. `<a href>` navigation); keep unhandled exceptions.
 */
const { jsdom } = globalThis as typeof globalThis & { jsdom?: IJsdomInstance };
const { virtualConsole } = jsdom ?? {};

if (virtualConsole) {
    virtualConsole.removeAllListeners('jsdomError');
    virtualConsole.on('jsdomError', error => {
        if (error.type === 'not-implemented') return;
        if (error.type === 'unhandled-exception') {
            originalError(error.cause?.stack ?? error.message);
            return;
        }
        originalError(error.message);
    });
}
