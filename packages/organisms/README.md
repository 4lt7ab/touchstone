# @touchstone/organisms

Atomic-design "organisms" — larger compositions of molecules and atoms that own a meaningful slice of UI.

This package is a **placeholder**: nothing ships yet. The layer is wired into the workspace, build, and Storybook so that adding the first organism is purely a matter of writing the component.

Examples of organisms that belong here as the library grows:

- `DataTable` — column definitions, sort/filter, virtualized rows
- `Dialog` — modal built on Radix `Dialog`
- `NavBar` — site/app top-level navigation
- `Form` — form layout/group conventions on top of `Field`

Organisms should be composed from atoms and molecules. If a piece of UI is screen-specific, it belongs in the consuming app, not here.
