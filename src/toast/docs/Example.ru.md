## Пример

```tsx
<AdminUiProvider>
    <ToastProvider maxVisibleToasts={3} defaultTimeout={4000}>
        <App />
        <ToastRegion />
    </ToastProvider>
</AdminUiProvider>
```

```tsx
import { useToast } from '@ensi-platform/admin-ui';

const { appendToast, closeToast } = useToast();

const key = appendToast({ title: 'Сохранено', variant: 'success' });

appendToast(
    { title: 'Ошибка', description: 'Не удалось сохранить', variant: 'danger' },
    { timeout: 8000, onClose: () => console.log('closed') }
);

closeToast(key);
```
