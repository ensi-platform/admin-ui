import { forwardRef, version, type ReactNode, type Ref } from 'react';

interface IRefComponent {
    (props: never): ReactNode;
    displayName?: string;
}

/** React 19 keeps the component. React 18 puts forwardRef's ref back into props. */
export const supportRefFor = <C extends IRefComponent>(major: number, component: C): C & { displayName?: string } => {
    if (major >= 19) return component;

    const Wrapped = forwardRef((props, ref: Ref<unknown>) => component({ ...props, ref } as never));

    Wrapped.displayName = component.displayName ?? component.name;

    return Wrapped as unknown as C & { displayName?: string };
};

/** Same as {@link supportRefFor} for the running React major. */
export const supportRef = <C extends IRefComponent>(component: C): C & { displayName?: string } =>
    supportRefFor(Number(version.split('.')[0]), component);
