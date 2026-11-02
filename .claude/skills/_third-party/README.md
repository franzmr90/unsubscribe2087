# Third-party skills

These eight skill folders are copied unchanged from
[gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)
at commit `19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9` (2026-10-28), under the Apache License 2.0.
The license and notice files sit beside this README.

- `game-feel`, `game-ai`, `ai-behavior-trees-utility-ai`, `shader-programming`,
  `performance-optimization`, `level-design`, `audio-design` (from `skills/disciplines/`)
- `rpg` (from `skills/genres/rpg/`)

They are Markdown only, with no scripts. Their examples are written for Godot, Unity and
Unreal; this game is plain canvas JavaScript, so read them for the method and translate.
They mention sibling skills (`camera-systems`, `godot-*`, `platformer` and others) that were
not copied; those references lead nowhere here.

None of this is part of the game. `build.sh` and `tools/pack-lan.js` copy named paths only,
so `.claude/` never reaches `dist/` or the LAN pack.
