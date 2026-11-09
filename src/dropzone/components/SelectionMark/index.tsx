import { Check } from '@/icons';

/** Decorative check on a selected file. */
export const SelectionMark = ({ className }: { className: string }) => (
    <span aria-hidden className={className} data-checked="" data-dropzone-check="">
        <Check />
    </span>
);
