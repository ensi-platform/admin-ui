import { type FieldError } from 'react-hook-form';

export const getError = (value?: FieldError) => (Array.isArray(value) ? value[0] : value);
