/** Autocomplete CSS variables from semantic tokens (--aui-combobox-*). */
export const docsCssVariables = `/* CSS variables — Autocomplete (--aui-combobox-*) */
--aui-combobox-bg-primary: var(--aui-input-bg-primary); /* primary fill */
--aui-combobox-fg-primary: var(--aui-input-fg-primary); /* primary foreground */
--aui-combobox-fg-muted: var(--aui-input-fg-muted); /* muted foreground */
--aui-combobox-border-primary: var(--aui-input-border-primary); /* primary border */
--aui-combobox-border-focus: var(--aui-input-border-focus); /* focus border */
--aui-combobox-border-danger: var(--aui-input-border-danger); /* danger border */

--aui-combobox-radius-md: var(--aui-input-radius-md); /* md radius */
--aui-combobox-h-sm: var(--aui-input-h-sm); /* height sm */
--aui-combobox-h-md: var(--aui-input-h-md); /* height md */
--aui-combobox-h-lg: var(--aui-input-h-lg); /* height lg */
--aui-combobox-pad-x-sm: var(--aui-input-pad-x-sm); /* padding-x sm */
--aui-combobox-pad-x-md: var(--aui-input-pad-x-md); /* padding-x md */
--aui-combobox-pad-x-lg: var(--aui-input-pad-x-lg); /* padding-x lg */
--aui-combobox-pad-y-sm: var(--aui-spacing-4); /* padding-y sm */
--aui-combobox-pad-y-md: var(--aui-spacing-4); /* padding-y md */
--aui-combobox-pad-y-lg: var(--aui-spacing-8); /* padding-y lg */
--aui-combobox-gap-sm: var(--aui-spacing-4); /* sm gap */
--aui-combobox-gap-md: var(--aui-spacing-8); /* md gap */
--aui-combobox-gap-lg: var(--aui-spacing-12); /* lg gap */
--aui-combobox-gap-tags-md: var(--aui-spacing-4); /* tags md gap */

--aui-combobox-icon-size-sm: var(--aui-spacing-12); /* icon size sm */
--aui-combobox-icon-size-md: var(--aui-spacing-16); /* icon size md */
--aui-combobox-icon-size-lg: var(--aui-spacing-20); /* icon size lg */
--aui-combobox-icon-hit-sm: var(--aui-spacing-16); /* icon hit sm */
--aui-combobox-icon-hit-md: var(--aui-spacing-24); /* icon hit md */
--aui-combobox-icon-hit-lg: var(--aui-spacing-32); /* icon hit lg */

--aui-combobox-list-pad-sm: var(--aui-spacing-4); /* list pad sm */
--aui-combobox-list-pad-md: var(--aui-spacing-4); /* list pad md */
--aui-combobox-list-pad-lg: var(--aui-spacing-8); /* list pad lg */

--aui-combobox-popover-bg-primary: var(--aui-surface-bg-elevated); /* popover bg primary */
--aui-combobox-popover-border-primary: var(--aui-surface-border-primary); /* popover border primary */
--aui-combobox-popover-radius-md: var(--aui-control-radius-md); /* popover radius md */
--aui-combobox-popover-max-h: 240px; /* popover max h */

--aui-combobox-item-bg-hover: var(--aui-surface-bg-muted); /* list item bg hover */
--aui-combobox-item-fg-primary: var(--aui-page-fg-primary); /* list item fg primary */
--aui-combobox-item-pad-x-sm: var(--aui-spacing-8); /* list item pad x sm */
--aui-combobox-item-pad-x-md: var(--aui-spacing-12); /* list item pad x md */
--aui-combobox-item-pad-x-lg: var(--aui-spacing-16); /* list item pad x lg */
--aui-combobox-item-pad-y-sm: var(--aui-spacing-4); /* list item pad y sm */
--aui-combobox-item-pad-y-md: var(--aui-spacing-4); /* list item pad y md */
--aui-combobox-item-pad-y-lg: var(--aui-spacing-8); /* list item pad y lg */
--aui-combobox-item-radius-md: var(--aui-control-radius-sm); /* list item radius md */

--aui-combobox-list-status-gap-md: var(--aui-spacing-8); /* list status gap md */

--aui-combobox-skeleton-h-md: var(--aui-spacing-32); /* skeleton h md */

--aui-combobox-list-status-min-h-md: calc(; /* list status min h md */

--aui-combobox-skeleton-bg-primary: var(--aui-surface-bg-muted); /* skeleton bg primary */
--aui-combobox-skeleton-bg-shine: var(--aui-surface-bg-elevated); /* skeleton bg shine */
--aui-combobox-skeleton-duration: 1.2s; /* skeleton duration */

--aui-combobox-tag-bg-primary: var(--aui-tag-bg-primary); /* tag bg primary */
--aui-combobox-tag-fg-primary: var(--aui-tag-fg-primary); /* tag fg primary */
--aui-combobox-tag-fg-muted: var(--aui-tag-fg-muted); /* tag fg muted */
--aui-combobox-tag-border-primary: var(--aui-tag-border-primary); /* tag border primary */
--aui-combobox-tag-border-focus: var(--aui-tag-border-focus); /* tag border focus */
--aui-combobox-tag-radius-md: var(--aui-tag-radius-md); /* tag radius md */
--aui-combobox-tag-gap-md: var(--aui-tag-gap-md); /* tag gap md */
--aui-combobox-tag-pad-y-sm: var(--aui-tag-pad-y-sm); /* tag pad y sm */
--aui-combobox-tag-pad-x-sm: var(--aui-tag-pad-x-sm); /* tag pad x sm */
--aui-combobox-tag-pad-y-md: var(--aui-tag-pad-y-md); /* tag pad y md */
--aui-combobox-tag-pad-x-md: var(--aui-tag-pad-x-md); /* tag pad x md */
--aui-combobox-tag-h-sm: var(--aui-tag-h-sm); /* tag h sm */
--aui-combobox-tag-h-md: var(--aui-tag-h-md); /* tag h md */
--aui-combobox-tag-icon-size-md: var(--aui-tag-icon-size-md); /* tag icon size md */
--aui-combobox-tag-icon-hit-md: var(--aui-tag-icon-hit-md); /* tag icon hit md */
--aui-combobox-tag-line-height: var(--aui-tag-line-height); /* tag line height */

--aui-combobox-overflow-bg-primary: var(--aui-combobox-tag-bg-primary); /* overflow chip bg primary */
--aui-combobox-overflow-fg-primary: var(--aui-combobox-tag-fg-primary); /* overflow chip fg primary */

--aui-combobox-duration-fast: var(--aui-control-duration-fast); /* transition duration (fast) */
--aui-combobox-ease-out: var(--aui-control-ease-out); /* transition easing */

--aui-field-clear-radius-md: var(--aui-control-radius-sm); /* md radius */

--aui-field-clear-icon-size-sm: var(--aui-combobox-icon-size-sm); /* icon size sm */
--aui-field-clear-icon-size-md: var(--aui-combobox-icon-size-md); /* icon size md */
--aui-field-clear-icon-size-lg: var(--aui-combobox-icon-size-lg); /* icon size lg */
--aui-field-clear-icon-hit-sm: var(--aui-combobox-icon-hit-sm); /* icon hit sm */
--aui-field-clear-icon-hit-md: var(--aui-combobox-icon-hit-md); /* icon hit md */
--aui-field-clear-icon-hit-lg: var(--aui-combobox-icon-hit-lg); /* icon hit lg */

--aui-field-clear-fg-muted: var(--aui-combobox-fg-muted); /* muted foreground */
--aui-field-clear-fg-primary: var(--aui-combobox-fg-primary); /* primary foreground */
--aui-field-clear-border-focus: var(--aui-combobox-border-focus); /* focus border */

--aui-field-clear-duration-fast: var(--aui-control-duration-fast); /* transition duration (fast) */
--aui-field-clear-ease-out: var(--aui-control-ease-out); /* transition easing */`;
