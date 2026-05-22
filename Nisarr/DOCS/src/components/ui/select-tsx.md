# select.tsx Analysis

**Path**: `src/components/ui/select.tsx`

## Overview
`Select` displays a list of options for the user to pick from—triggered by a button. Built on `@radix-ui/react-select`.

## Detailed Code Analysis

### Components
- **`Select`**: Root.
- **`SelectTrigger`**: The button displaying the current value.
- **`SelectContent`**: The dropdown popover.
    - `position="popper"` default (renders outside DOM hierarchy slightly).
    - Includes `SelectScrollUpButton` and `SelectScrollDownButton` for long lists.
- **`SelectItem`**:
    - Selectable option.
    - Includes `Check` icon indicator (`left-2`).
- **`SelectLabel` / `SelectSeparator`**:
    - For grouping items.

### Key Logic
- Complex positioning logic (`position=popper`) ensures the menu doesn't get clipped and behaves like a native select menu.
