export const docsCssVariables = `/* CSS variables — CascadeMenu (--aui-cascade-menu-*)
 * Light/default values below (semantic.css). Dark remap: black-900 / grey-700 in semantic.dark.css.
 */
--aui-cascade-menu-bg-primary: var(--aui-page-bg-primary); /* L0 column — same as page (grey-50 / black-900) */
--aui-cascade-menu-fg-primary: var(--aui-page-fg-primary); /* primary text / logo currentColor */
--aui-cascade-menu-fg-muted: var(--aui-page-fg-muted); /* secondary text on L0 */
--aui-cascade-menu-border-divider: var(--aui-surface-border-primary); /* footer / edges / L0+flyout border-right; dark = white 12% */
--aui-cascade-menu-border-focus: var(--aui-control-border-focus); /* focus / resize hover */
--aui-cascade-menu-w-md: 280px; /* default L0 width token (resize 200–400) */
--aui-cascade-menu-w-collapsed: 64px; /* collapsed rail width */
--aui-cascade-menu-radius-md: var(--aui-radius-4); /* item / control soft pill radius */
--aui-cascade-menu-pad-x-md: var(--aui-spacing-12); /* column pad x */
--aui-cascade-menu-pad-y-md: var(--aui-spacing-12); /* column pad y */
--aui-cascade-menu-flyout-header-mb: var(--aui-spacing-4); /* flyout section title margin below */
--aui-cascade-menu-gap-brand-md: var(--aui-spacing-12); /* brand to body gap */
--aui-cascade-menu-user-pad-y-md: var(--aui-spacing-12); /* footer top pad */
--aui-cascade-menu-handle-w: 4px; /* resize handle width */
--aui-cascade-menu-item-bg-hover: var(--aui-surface-bg-muted); /* L0 item / user / collapse hover; dark = grey-700 */
--aui-cascade-menu-item-bg-active: transparent; /* current leaf — no fill (breadcrumbs own “where am I”) */
--aui-cascade-menu-item-bg-active-hover: var(--aui-surface-bg-muted); /* current leaf hover = same as hover; dark = grey-700 */
--aui-cascade-menu-item-bg-open: var(--aui-surface-bg-muted); /* open folder / path fill; dark = grey-700 */
--aui-cascade-menu-item-bg-open-hover: var(--aui-surface-bg-muted-hover); /* open folder hover; dark = white 8% on grey-700 */
--aui-cascade-menu-nested-bg: var(--aui-cascade-menu-bg-primary); /* flyout fill = L0 chrome */
--aui-cascade-menu-nested-shadow: none; /* full-height panel flush to L0 — no elevation */
--aui-cascade-menu-z: var(--aui-z-chrome); /* L0 stacking context — above sticky table, below dropdown */
--aui-cascade-menu-flyout-z: 20; /* flyout inside chrome context */
--aui-cascade-menu-duration-fast: var(--aui-control-duration-fast); /* short chrome transitions */
--aui-cascade-menu-duration-normal: var(--aui-control-duration-normal); /* L0 width collapse / expand */
--aui-cascade-menu-ease-out: var(--aui-control-ease-out); /* easing */
`;
