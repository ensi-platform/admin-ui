import { Extension } from '@tiptap/core';

const preserved = (name: 'class' | 'id') => ({
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.getAttribute(name),
    renderHTML: (attributes: Record<string, unknown>) => {
        const value = attributes[name];

        if (typeof value !== 'string' || !value) {
            return {};
        }

        return { [name]: value };
    },
});

const styleWithoutOwned = (style: string) =>
    style
        .split(';')
        .map(part => part.trim())
        .filter(part => part && !/^text-align\s*:/i.test(part) && !/^margin-left\s*:/i.test(part))
        .join('; ');

/** Keeps `class`, `id`, and `style` on the blocks and marks the toolbar edits. */
export const GlobalAttributes = Extension.create({
    name: 'globalAttributes',

    addGlobalAttributes() {
        return [
            {
                types: [
                    'paragraph',
                    'heading',
                    'bulletList',
                    'orderedList',
                    'listItem',
                    'link',
                    'image',
                    'blockquote',
                    'codeBlock',
                    'iframe',
                ],
                attributes: {
                    class: preserved('class'),
                    id: preserved('id'),
                    style: {
                        default: null,
                        parseHTML: (element: HTMLElement) => {
                            const raw = element.getAttribute('style');

                            if (!raw) {
                                return null;
                            }

                            const kept = styleWithoutOwned(raw);

                            return kept || null;
                        },
                        renderHTML: (attributes: Record<string, unknown>) => {
                            const parts: string[] = [];

                            if (typeof attributes.style === 'string' && attributes.style) {
                                parts.push(attributes.style);
                            }

                            if (typeof attributes.textAlign === 'string' && attributes.textAlign) {
                                parts.push(`text-align: ${attributes.textAlign}`);
                            }

                            const indent = Number(attributes.indent);

                            if (indent > 0) {
                                parts.push(`margin-left: ${indent * 24}px`);
                            }

                            if (!parts.length) {
                                return {};
                            }

                            return { style: parts.join('; ') };
                        },
                    },
                },
            },
        ];
    },
});
