import { type ComponentPropsWithRef, type Ref } from 'react';

import { type IDataTestIdProps } from '@ds/common';

import { type IFieldStateProps } from '@/field/types';
import { type IFormFieldLayoutProps } from '@/form/types';

export type TTextEditorSize = 'sm' | 'md' | 'lg';

export type TTextEditorVariant = 'primary';

/** Theme inputs. */
export interface ITextEditorThemeProps {
    /** Control size. Inside Field, inherits `Field.size` when omitted. */
    size?: TTextEditorSize;
    /** Visual variant. */
    variant?: TTextEditorVariant;
}

/** Control state (our names, not RAC). */
export interface ITextEditorControlProps {
    /** HTML string. An empty document is `''`. */
    value?: string;
    /** Uncontrolled initial HTML. */
    defaultValue?: string;
    /** Called with the next HTML string. */
    onChange?: (value: string) => void;
    /** Called when the visual surface or the source textarea blurs. */
    onBlur?: () => void;
    /** Visible and copyable, but not editable. Not `disabled`. */
    readOnly?: boolean;
}

/** Own / chrome props (not from DOM). */
export interface ITextEditorOwnProps extends IDataTestIdProps {
    /** Ref to the editor shell (React 19 prop). */
    ref?: Ref<HTMLDivElement>;
    /** Replaces the built-in font menu. */
    fontFamilies?: readonly string[];
    /** Stores an image file and returns the URL to insert. Hidden when omitted. */
    uploadImage?: (file: File) => Promise<string>;
    /** Visible-text ceiling. Further input is ignored. */
    maxLength?: number;
}

export interface ITextEditorBaseProps
    extends ITextEditorThemeProps, IFieldStateProps, ITextEditorControlProps, ITextEditorOwnProps {}

type TTextEditorDivOmit = 'onChange' | 'defaultValue' | 'children';

export interface ITextEditorProps
    extends Omit<ComponentPropsWithRef<'div'>, keyof ITextEditorBaseProps | TTextEditorDivOmit>, ITextEditorBaseProps {}

/** Content slice for FormTextEditor. */
export interface ITextEditorContentProps extends Omit<
    ITextEditorControlProps,
    'value' | 'defaultValue' | 'onChange' | 'onBlur'
> {}

export interface IFormTextEditorProps
    extends IFormFieldLayoutProps, Pick<ITextEditorThemeProps, 'variant'>, ITextEditorContentProps {}
