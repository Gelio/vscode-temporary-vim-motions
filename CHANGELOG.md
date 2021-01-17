# Change Log

## v0.0.1 (2021-01-17)

- Initial release
- Add an _Execute vim motions_ command that allows to jump to a nearby relative line
- Switches to relative lines when invoking the command (configurable in the settings)
- Highlights the cursor destination
- Handle multiple motions in a single execution (e.g. `10j2k`)
- Handle line start/end motions (`$`, `^`)
- Handle word boundary motions (`w`, `e`, `b`) (supports repetitions, e.g. `10w`)
- Handle find next/previous character motions (`F`, `f`) (supports repetitions, e.g. `2f"`)
- When moving close to top/bottom of the editor, scrolls to show surrounding lines (configurable in the settings)
