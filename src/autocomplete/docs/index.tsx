import { Autocomplete } from '../Component';
import { type IAutocompleteProps } from '../types';

/** Story wrapper for react-docgen-typescript. */
export const AutocompleteStoryComponent = (props: IAutocompleteProps) => <Autocomplete {...props} />;

AutocompleteStoryComponent.displayName = 'Autocomplete';
