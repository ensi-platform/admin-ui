import { type ComponentProps, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { supportRef } from '@ds/common/support-ref';

import { Field, useField } from '@/field';
import { useFieldHook } from '@/form/hooks/useFieldHook';
import { getError } from '@/form/utils';
import { useAuiLabels } from '@/provider';

import { Dropzone } from './Component';
import {
    type IDropzoneFile,
    type IDropzonePendingState,
    type IFormDropzoneProps,
    type TDropzoneDisabled,
} from './types';

const PENDING_ERROR = 'dropzone-pending';
const EMPTY_FILES: IDropzoneFile[] = [];

type TFormDropzoneControlProps = Omit<ComponentProps<typeof Dropzone>, 'size' | 'invalid' | 'disabled'> & {
    disabled?: TDropzoneDisabled;
};

const FormDropzoneControl = supportRef((props: TFormDropzoneControlProps) => {
    const { controlProps, size, invalid, disabled } = useField();
    const { disabled: disabledProp, ...rest } = props;

    return <Dropzone {...rest} {...controlProps} size={size} invalid={invalid} disabled={disabledProp ?? disabled} />;
});

const pendingMessage = (state: IDropzonePendingState, labels: ReturnType<typeof useAuiLabels>) => {
    if (state.uploading) {
        return labels.dropzoneUploading;
    }

    if (state.failed) {
        return labels.dropzoneUploadFailed;
    }

    return '';
};

export const FormDropzone = ({
    name,
    label,
    hint,
    size = 'md',
    block = true,
    disabled,
    className,
    dataTestId,
    variant,
    ref,
    ...content
}: IFormDropzoneProps) => {
    const labels = useAuiLabels();
    const labelsRef = useRef(labels);
    const pendingRef = useRef<IDropzonePendingState>({ uploading: false, failed: false });
    const { control, setError, clearErrors, getFieldState } = useFormContext();
    const rules = useMemo(
        () => ({
            validate: () => pendingMessage(pendingRef.current, labelsRef.current) || true,
        }),
        []
    );
    const { field, fieldState, inputProps, setFieldValue, onBlurHandler } = useFieldHook({ name, rules });
    const { disabled: formDisabled } = inputProps;
    const error = getError(fieldState.error);
    const [rejection, setRejection] = useState('');
    const [pendingError, setPendingError] = useState('');
    const isDisabled = formDisabled || disabled;
    const files = Array.isArray(field.value) ? (field.value as IDropzoneFile[]) : EMPTY_FILES;
    const formMessage = error?.type === PENDING_ERROR ? '' : error?.message;
    const message = [formMessage, pendingError, rejection].filter(Boolean).join(' ');

    useLayoutEffect(() => {
        labelsRef.current = labels;
    }, [labels]);

    // Field rules do not run when the form already has a resolver.
    // eslint-disable-next-line no-underscore-dangle -- react-hook-form keeps the resolver here
    const options = control._options;

    useLayoutEffect(() => {
        const previous = options.resolver;

        if (!previous) {
            return undefined;
        }

        const wrapped: typeof previous = async (values, context, resolverOptions) => {
            const base = await previous(values, context, resolverOptions);
            const pendingText = pendingMessage(pendingRef.current, labelsRef.current);

            if (!pendingText) {
                return base;
            }

            return {
                values: {},
                errors: {
                    ...base.errors,
                    [name]: { type: PENDING_ERROR, message: pendingText },
                },
            };
        };

        options.resolver = wrapped;

        return () => {
            if (options.resolver === wrapped) {
                options.resolver = previous;
            }
        };
    }, [name, options]);

    const onPendingChange = useCallback(
        (state: IDropzonePendingState) => {
            pendingRef.current = state;
            const nextMessage = pendingMessage(state, labelsRef.current);

            setPendingError(nextMessage);

            if (nextMessage) {
                setError(name, { type: PENDING_ERROR, message: nextMessage });
                return;
            }

            if (getFieldState(name).error?.type === PENDING_ERROR) {
                clearErrors(name);
            }
        },
        [clearErrors, getFieldState, name, setError]
    );

    return (
        <Field
            invalid={Boolean(message)}
            disabled={isDisabled === true}
            size={size}
            block={block}
            className={className}
            dataTestId={dataTestId}
        >
            {label ? <Field.Label>{label}</Field.Label> : null}
            <FormDropzoneControl
                {...content}
                ref={ref}
                variant={variant}
                disabled={isDisabled}
                value={files}
                onChange={next => {
                    setFieldValue(next);
                }}
                onBlur={() => {
                    onBlurHandler();
                }}
                onRejectionChange={setRejection}
                onPendingChange={onPendingChange}
            />
            {hint ? <Field.Hint>{hint}</Field.Hint> : null}
            <Field.Error>{message}</Field.Error>
        </Field>
    );
};

FormDropzone.displayName = 'FormDropzone';
