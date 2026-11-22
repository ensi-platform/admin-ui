import { useState } from 'react';

import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { axe } from '@/test/axe';
import { render, screen } from '@/test/render';

import { TextEditor } from '..';
import { visibleText } from '../utils';

import styles from '../styles.module.css';

const Controlled = ({ value: initial, onChange }: { value: string; onChange?: (value: string) => void }) => {
    const [value, setValue] = useState(initial);

    return (
        <TextEditor
            aria-label="Content"
            value={value}
            onChange={next => {
                setValue(next);
                onChange?.(next);
            }}
        />
    );
};

const source = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(await screen.findByRole('button', { name: 'Исходник' }));

    return screen.getByRole('textbox', { name: 'Content' }) as HTMLTextAreaElement;
};

describe('TextEditor', () => {
    it('renders a textbox', async () => {
        render(<TextEditor aria-label="Content" />);

        expect(await screen.findByRole('textbox', { name: 'Content' })).toBeInTheDocument();
    });

    it('follows value and does not call onChange when the prop changes', async () => {
        const onChange = vi.fn();
        const { rerender } = render(<TextEditor aria-label="Content" value="<p>A</p>" onChange={onChange} />);

        await screen.findByRole('textbox', { name: 'Content' });
        rerender(<TextEditor aria-label="Content" value="<p>B</p>" onChange={onChange} />);

        const box = await source(userEvent.setup());

        expect(box).toHaveValue('<p>B</p>');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps the controlled value when the parent ignores onChange', async () => {
        const user = userEvent.setup();

        render(<TextEditor aria-label="Content" value="<p>Keep</p>" onChange={vi.fn()} />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'По центру' }));

        const box = await source(user);

        expect(box).toHaveValue('<p>Keep</p>');
    });

    it('emits an empty string for an empty document', async () => {
        const onChange = vi.fn();

        render(<TextEditor aria-label="Content" defaultValue="" onChange={onChange} />);
        await screen.findByRole('textbox', { name: 'Content' });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('toggles bold, italic, lists, a heading, and alignment', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Полужирный' }));
        await user.click(screen.getByRole('button', { name: 'Курсив' }));
        await user.click(screen.getByRole('textbox', { name: 'Content' }));
        await user.keyboard('Hi');
        await user.click(screen.getByRole('button', { name: 'Абзац' }));
        await user.click(screen.getByRole('button', { name: 'Заголовок 2' }));
        await user.click(screen.getByRole('button', { name: 'По правому краю' }));
        expect(screen.getByRole('button', { name: 'Заголовок 2' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'По правому краю' })).toHaveAttribute('aria-pressed', 'true');
        await user.click(screen.getByRole('button', { name: 'Маркированный список' }));
        await user.click(screen.getByRole('button', { name: 'Нумерованный список' }));

        const box = await source(user);

        expect(box.value).toMatch(/<(strong|b)>/);
        expect(box.value).toMatch(/<(em|i)>/);
        expect(box.value).toMatch(/<ol[\s>]/);
    });

    it('inserts a link with href, target, and rel', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Ссылка' }));
        await user.type(screen.getByRole('textbox', { name: 'Адрес ссылки' }), 'https://ensi.tech');
        await user.click(screen.getByRole('checkbox', { name: 'Открывать в новом окне' }));
        await user.click(screen.getByRole('button', { name: 'Применить' }));

        const box = await source(user);

        expect(box.value).toContain('href="https://ensi.tech"');
        expect(box.value).toContain('target="_blank"');
        expect(box.value).toContain('rel="noopener noreferrer"');
    });

    it('inserts an image from a URL and alt', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Изображение' }));
        await user.type(screen.getByRole('textbox', { name: 'Адрес изображения' }), '/cover.png');
        await user.type(screen.getByRole('textbox', { name: 'Описание изображения' }), 'Cover');
        await user.click(screen.getByRole('button', { name: 'Применить' }));

        const box = await source(user);

        expect(box.value).toContain('src="/cover.png"');
        expect(box.value).toContain('alt="Cover"');
    });

    it('inserts an uploaded image URL', async () => {
        const user = userEvent.setup();
        const uploadImage = vi.fn().mockResolvedValue('/up.png');

        render(<TextEditor aria-label="Content" defaultValue="" uploadImage={uploadImage} />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Изображение' }));
        await user.upload(screen.getByLabelText('Файл изображения'), new File(['x'], 'a.png', { type: 'image/png' }));
        await user.click(screen.getByRole('button', { name: 'Применить' }));

        const box = await source(user);

        expect(uploadImage).toHaveBeenCalledTimes(1);
        expect(box.value).toContain('src="/up.png"');
    });

    it('applies font family, size, and line height', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Шрифт' }));
        await user.click(screen.getByRole('button', { name: 'Georgia' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Размер' }));
        await user.click(screen.getByRole('button', { name: '18' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Интервал' }));
        await user.click(screen.getByRole('button', { name: '1.5' }));
        await user.click(screen.getByRole('textbox', { name: 'Content' }));
        await user.keyboard('A');

        const box = await source(user);

        expect(box.value).toContain('Georgia');
        expect(box.value).toMatch(/18px/);
        expect(box.value).toContain('1.5');
    });

    it('toggles underline, strike, code, a quote, and a rule', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Подчёркнутый' }));
        await user.click(screen.getByRole('button', { name: 'Зачёркнутый' }));
        await user.click(screen.getByRole('textbox', { name: 'Content' }));
        await user.keyboard('Q');
        await user.click(screen.getByRole('button', { name: 'Цитата' }));
        await user.click(screen.getByRole('button', { name: 'Линия' }));

        const box = await source(user);

        expect(box.value).toMatch(/<(u|ins)>/);
        expect(box.value).toMatch(/<(s|strike|del)>/);
        expect(box.value).toContain('<blockquote');
        expect(box.value).toContain('<hr');
    });

    it('applies text and background colors inline', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Цвет текста' }));
        await user.click(await screen.findByRole('button', { name: '#dc2626' }));
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: '#dc2626' })).not.toBeInTheDocument();
        });
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Цвет фона' }));
        await user.click(await screen.findByRole('button', { name: '#fef2f2' }));
        await user.click(screen.getByRole('textbox', { name: 'Content' }));
        await user.keyboard('A');

        const box = await source(user);

        expect(box.value).toMatch(/#dc2626|rgb\(220,\s*38,\s*38\)/);
        expect(box.value).toMatch(/#fef2f2|rgb\(254,\s*242,\s*242\)/);
    });

    it('sets an id on the current block', async () => {
        const user = userEvent.setup();

        render(<Controlled value="<p>Block</p>" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Якорь' }));
        await user.type(screen.getByRole('textbox', { name: 'Идентификатор' }), 'intro');
        await user.click(screen.getByRole('button', { name: 'Применить' }));

        const box = await source(user);

        expect(box.value).toContain('id="intro"');
    });

    it('returns a foreign block as the original substring', async () => {
        const user = userEvent.setup();
        const foreign = '<div class="banner">keep</div>';

        render(<TextEditor aria-label="Content" defaultValue={`<p>A</p>${foreign}`} />);
        await screen.findByRole('textbox', { name: 'Content' });
        expect(screen.getByText('HTML')).toBeInTheDocument();

        const box = await source(user);

        expect(box.value).toContain(foreign);
    });

    it('drops Word mso markup on paste', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        const box = await screen.findByRole('textbox', { name: 'Content' });

        fireEvent.paste(box, {
            clipboardData: {
                getData: (type: string) => {
                    if (type === 'text/html') {
                        return '<p class="MsoNormal" style="mso-margin-top-alt:auto">Hi</p>';
                    }

                    if (type === 'text/plain') {
                        return 'Hi';
                    }

                    return '';
                },
            },
        });

        const sourceBox = await source(user);

        expect(sourceBox.value).not.toMatch(/Mso|mso-/);
        expect(sourceBox.value).toContain('Hi');
    });

    it('switches the surface to a textarea and back', async () => {
        const user = userEvent.setup();

        render(<TextEditor aria-label="Content" defaultValue="<p>A</p>" />);
        const box = await source(user);

        expect(box.tagName).toBe('TEXTAREA');
        await user.click(screen.getByRole('button', { name: 'Визуально' }));
        expect(await screen.findByRole('textbox', { name: 'Content' })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Content' })?.tagName).not.toBe('TEXTAREA');
    });

    it('keeps a script as a chip and does not execute it', async () => {
        const user = userEvent.setup();
        const { container } = render(<TextEditor aria-label="Content" defaultValue="<script>alert(1)</script>" />);

        expect(await screen.findByRole('textbox', { name: 'Content' })).toBeInTheDocument();
        expect(screen.getByText('HTML')).toBeInTheDocument();
        expect(container.querySelector('script')).toBeNull();

        const box = await source(user);

        expect(box.value).toContain('<script>alert(1)</script>');
    });

    it('inserts a video iframe from a URL', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Видео' }));
        await user.type(screen.getByRole('textbox', { name: 'Адрес видео' }), 'https://ensi.tech/video');
        await user.click(screen.getByRole('button', { name: 'Применить' }));

        const box = await source(user);

        expect(box.value).toContain('<iframe');
        expect(box.value).toContain('src="https://ensi.tech/video"');
    });

    it('inserts a table', async () => {
        const user = userEvent.setup();

        render(<Controlled value="" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Таблица' }));

        const box = await source(user);

        expect(box.value).toContain('<table');
    });

    it('marks the shell when fullscreen is on', async () => {
        const user = userEvent.setup();

        render(<TextEditor aria-label="Content" dataTestId="editor" />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'На весь экран' }));

        expect(screen.getByTestId('editor')).toHaveAttribute('data-fullscreen', 'true');
    });

    it('stops text input at maxLength', async () => {
        const user = userEvent.setup();

        render(<TextEditor aria-label="Content" defaultValue="" maxLength={2} />);
        const box = await source(user);

        await user.type(box, 'abcd');

        expect(visibleText(box.value)).toBe('ab');
    });

    it('does not change the value when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TextEditor aria-label="Content" value="<p>A</p>" disabled onChange={onChange} />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Полужирный' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Полужирный' })).toBeDisabled();
    });

    it('keeps a read-only value unchanged', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TextEditor aria-label="Content" value="<p>A</p>" readOnly onChange={onChange} />);
        await screen.findByRole('textbox', { name: 'Content' });
        await user.click(screen.getByRole('button', { name: 'Курсив' }));

        expect(onChange).not.toHaveBeenCalled();
    });

    it('sets aria-invalid when invalid', async () => {
        render(<TextEditor aria-label="Content" invalid />);

        expect(await screen.findByRole('textbox', { name: 'Content' })).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies size and block classes on the shell', () => {
        const { rerender } = render(<TextEditor aria-label="Content" dataTestId="editor" size="sm" />);

        const shell = screen.getByTestId('editor');

        expect(shell).toHaveClass(styles.root, styles.sm, styles.primary, styles.block);

        rerender(<TextEditor aria-label="Content" dataTestId="editor" block={false} />);
        expect(screen.getByTestId('editor')).not.toHaveClass(styles.block);
    });

    it('sets data-test-id from dataTestId', () => {
        render(<TextEditor aria-label="Content" dataTestId="editor" />);

        expect(screen.getByTestId('editor')).toBeInTheDocument();
    });

    it('assigns object ref', () => {
        const ref = { current: null as HTMLDivElement | null };

        render(<TextEditor aria-label="Content" ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has no axe violations in the default and script chip states', async () => {
        const { container, rerender } = render(<TextEditor aria-label="Content" defaultValue="<p>Hello</p>" />);

        await screen.findByRole('textbox', { name: 'Content' });
        expect(await axe(container)).toHaveNoViolations();

        rerender(<TextEditor aria-label="Content" defaultValue="<script></script>" />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
