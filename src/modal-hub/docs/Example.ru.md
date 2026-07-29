## Пример

```tsx
<AdminUiProvider>
    <ModalProvider>
        <App />
        <ModalHub />
    </ModalProvider>
</AdminUiProvider>
```

```tsx
const ConfirmModal = ({ open, onOpenChange, onExitComplete }: IModalHubItemProps) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete}>
        …
    </Modal>
);

const { onOpenHandler } = useModal({ Component: ConfirmModal });
```
