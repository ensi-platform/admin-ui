import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { CopyButton } from '../Component';
import { type ICopyButtonProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

type TCopyButtonStoryProps = ICopyButtonProps;

const DEFAULT_ARGS: TCopyButtonStoryProps = {
    children: '100245',
    timeout: 1000,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<TCopyButtonStoryProps>> = {
    children: { control: { type: 'text' } },
    timeout: { control: { type: 'number' } },
};

const CopyButtonDemo = (props: TCopyButtonStoryProps) => <CopyButton {...props} />;

CopyButtonDemo.displayName = 'CopyButton';

export default {
    title: 'Base/CopyButton',
    component: CopyButtonDemo,
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
} satisfies Meta<typeof CopyButtonDemo>;

export const Default: StoryObj<typeof CopyButtonDemo> = {};
