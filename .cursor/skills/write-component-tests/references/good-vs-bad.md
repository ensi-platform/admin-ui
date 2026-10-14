# Good vs bad — examples from this repo

## 1. «renders» is not a test

Bad (`select.test.tsx`, `autocomplete.test.tsx`):

```tsx
it('renders combobox', () => {
    render(<Select aria-label="Status" options={OPTIONS} />);

    expect(screen.getByRole('button', { name: /Status/ })).toBeInTheDocument();
});
```

Passes if the component renders an empty button. Replace with what the user gets:

```tsx
it('shows the placeholder, then the label of the chosen option', async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Status" options={OPTIONS} placeholder="Choose" />);

    const trigger = screen.getByRole('button', { name: /Status/ });
    const group = screen.getByRole('group'); // the selected label lives here, not inside the chevron button

    expect(group).toHaveTextContent('Choose');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Опубликован' }));

    expect(group).toHaveTextContent('Опубликован');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus()); // react-aria restores focus asynchronously
});
```

These examples were run against the real `Select` while writing this skill. Two lessons from that: the trigger `button` contains only the chevron (the visible value is a sibling `span` in `role="group"`), and focus restoration needs `waitFor`. Always probe the real DOM once before writing assertions.

## 2. Keyboard and disabled options are part of the contract

Missing in `Select` today. Minimum set:

```tsx
it('opens with ArrowDown, skips disabled options, commits with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select aria-label="Status" options={OPTIONS} onChange={onChange} />);

    screen.getByRole('button', { name: /Status/ }).focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('published'); // 'archived' is disabled and must be skipped
});

it('does not select a disabled option on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select aria-label="Status" options={OPTIONS} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Status/ }));
    await user.click(screen.getByRole('option', { name: 'Архив' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument(); // still open: nothing was committed
});

it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Status" options={OPTIONS} />);

    const trigger = screen.getByRole('button', { name: /Status/ });

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
});
```

## 3. Controlled vs uncontrolled

```tsx
it('uses defaultValue and keeps updating by itself', async () => { /* uncontrolled: shows label, user changes it, label follows */ });

it('follows the value prop and does not call onChange for it', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Select aria-label="S" options={OPTIONS} value="draft" onChange={onChange} />);

    rerender(<Select aria-label="S" options={OPTIONS} value="published" onChange={onChange} />);

    expect(screen.getByRole('group')).toHaveTextContent('Опубликован');
    expect(onChange).not.toHaveBeenCalled();
});
```

## 4. «covers … branches» — delete or turn into a scenario

Bad (`form.test.tsx`):

```tsx
it('covers useFieldHook onChangeHandler val and empty event branches', async () => {
    render(<Form …><FieldHookBranchesField /></Form>);
    await waitFor(() => expect(screen.getByLabelText('Email')).toHaveValue('from-val'));
});
```

The title says the goal is a branch. Rewrite as the user flow the branch serves:

```tsx
it('accepts a raw value (not an event) from a custom control and submits it', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Form initialValues={{ email: '' }} onSubmit={onSubmit}><CustomEmailControl /><button type="submit">Send</button></Form>);

    await user.click(screen.getByRole('button', { name: 'Choose preset' })); // control calls onChange('a@b.c')
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.c' });
});
```

If no real consumer can reach that branch, remove the branch from the source instead.

## 5. Mocking the library to reach `null`

Bad (`tabs-null-selection.test.tsx`): replaces RAC `Tabs` with a fake that calls `onSelectionChange(null)` during render, then asserts `onChange` was not called. It verifies the mock, and RAC never does this.

Do instead:

- Drive the real component with real events (click, arrows, disabled tab) and assert `onChange` args/count.
- If the `null` guard exists only for TypeScript, express it in types or remove the branch; do not keep a test for it.

## 6. Positive control for «does not»

Bad:

```tsx
render(<Select disabled … />);
await user.click(trigger);
expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
```

If the selector is wrong this passes forever. Pair with the enabled case in the same file, and assert the DOM reason (`toBeDisabled()` or `aria-disabled`).

## 7. A red test is not always the component's fault

`provider.test.tsx` «renders the root as body»: React 19 applies the props to the existing `document.body`, and `screen.getByTestId` searches only descendants of `document.body`, so it can never match body itself. The component is fine; the test asked the impossible. Correct fix: assert on `document.body` directly (`toHaveAttribute('data-test-id', 'aui-root')`, `toHaveClass(styles.root)`), and state in the PR why. The wrong fix is deleting or loosening the test.

## 8. Style classes

Acceptable (presentational, secondary):

```tsx
expect(screen.getByText('Оплачен')).toHaveClass(styles.sm, styles.success);
```

Not acceptable as the only check for a behavioral component: `Select` «applies size and variant classes» says nothing about whether the list is usable at that size. Keep it, but add the functional tests from sections 1–3.

## 9. Mutation check example

Temporarily break the source in the way a real bug would (e.g. stop passing `disabled` through to the option, or call `onChange` twice) → the matching test («does not select a disabled option», `toHaveBeenCalledTimes(1)`) must go red. If it stays green, the test is checking the wrong thing. Revert (`git diff` on the source file must be empty) and report «tried: <mutation> → <test> failed as expected».
