# GridLayout

| Scenario | Proof |
| --- | --- |
| Equal columns, full span, explicit tracks | `it('lays out equal columns and a full-width item')`, `it('spans a set number of columns and accepts fr tracks')` |
| `hidden` | `it('accepts explicit tracks and hides the grid')` |
| `align` class | `it('aligns items to the center')` |
| ref | `it('forwards ref to the grid')` |
| axe | `it('has no axe violations')` |
| Painted row positions | needs browser — jsdom has no layout |
