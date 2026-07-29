## Example

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

const key = appendToast({ title: 'Saved', variant: 'success' });

appendToast(
    { title: 'Error', description: 'Could not save', variant: 'danger' },
    { timeout: 8000, onClose: () => console.log('closed') }
);

closeToast(key);
```
