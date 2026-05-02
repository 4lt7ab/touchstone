# @touchstone/organisms

Atomic-design "organisms" — larger compositions of molecules and atoms that own a meaningful slice of UI.

| Component | Composes / behavior                                                                                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dialog`  | Modal panel composed from `useDisclosure`, `useFocusTrap`, `useFocusReturn`, `useEscapeKey`, `useClickOutside`, `useScrollLock`. Built-in dismiss uses the `Button` icon-shape variant. |
| `Popover` | Non-modal anchored panel composed from `useDisclosure`, `useAnchoredPosition`, `useEscapeKey`, `useFocusReturn`. Trigger toggles, outside-click and Escape close.                       |

Organisms compose atoms, molecules, and hooks. If a piece of UI is screen-specific, it belongs in the consuming app, not here.
