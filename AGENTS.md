# Component development guidance

## Visual style

- Components should feel soft, calm, and gently rounded.
- Use flat, solid fills. Component containers, cards, buttons, dropdowns, and
  toggle tracks should have no decorative borders, outlines, or shadows.
- Separate surfaces with color and spacing. Keep cards distinct from the page
  background and light-mode surfaces clean rather than grey or muddy.
- Use filled accent strips and small semantic markers where appropriate.
  Explicitly requested icons or markers, such as outlined breadcrumb circles,
  are content rather than container borders.
- Keep controls compact while giving labels, grouped options, and focus
  indicators comfortable space.

## Motion

- Transitions should be soft and delicate, typically around 120–250ms.
- Favor subtle color shifts, opacity changes, small movements, and gentle
  expansion or collapse with ease-out or ease-in-out easing.
- Let dismissible content fade and release its layout space smoothly before
  removing it. Fire dismissal callbacks after the exit finishes.
- Keep motion restrained: avoid bouncing, large scaling, exaggerated travel,
  and abrupt visual changes.
- Respect `prefers-reduced-motion`. Remove decorative movement and dismiss
  immediately when reduced motion is requested.
- Clean up animation timers when components unmount.

## Themes and styling

- Support every theme in both light and dark modes, including hover, focus,
  active, and disabled states.
- Use existing theme tokens and CSS variables. Keep custom-color overrides
  available where a component needs them.
- Use theme-colored tints for light-mode interaction feedback. Preserve the
  theme's hue instead of applying a generic black or grey wash.
- Keep default styles in the library stylesheet, using classes and data
  attributes. Reserve inline styles for explicit overrides and measurements
  needed for behavior, such as an exit animation's height.
- Edit TypeScript theme sources and regenerate theme CSS; do not hand-edit
  `src/theme/themes.css`.
- Inherit the shared typography and `--mx-font-scale` so text scales consistently.

## Accessibility and behavior

- Preserve a clear, rounded keyboard focus indicator. The borderless visual
  style applies to decoration, not the focus indication needed for navigation.
- Prefer semantic HTML and native keyboard behavior, with accessible labels,
  descriptions, and appropriate grouping.
- Keep decorative icons and separators hidden from assistive technology.
- Announce notifications appropriately without taking focus. Pause timed
  nudges while hovered or focused, and support persistent messages.
- Keep components reusable: put shared behavior and spacing in the component,
  and keep demo-specific content in the demo.

## Implementation and verification

- Follow the existing component folder structure and public prop conventions.
- Export new components and types from `src/index.ts`, document their props,
  and add a working example in the relevant dashboard section.
- Keep dashboard sections and examples in separate components.
- Test meaningful behavior, keyboard interactions, state changes, and cleanup.
  Use existing checks for small cosmetic changes rather than adding tests
  that merely repeat CSS declarations.
- Run the checks appropriate to the change: targeted tests, `npm run typecheck`,
  and library/demo builds as applicable. Report any remaining limitations.
