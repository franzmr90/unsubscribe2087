# Story objective order

After The Audit, the corner objective said Going Up / The Updraft / Foreman Ratchet while Exit Interview was still unspoken. The cathedral itself was fine: walking in still started Exit Interview.

## Root cause

`storyStep` walks `for (const k in QUESTS)`. Those keys are strings, so the walk follows the order the fields were written. Exit Interview (`q5`) was the last field in the Act I–III table, after Still Water (`q15`). The first unfinished quest after The Audit was therefore Going Up (`q6`).

The quest trigger is a different line. `enter` sets a zone’s quest to active when it is still 0. That is why the cathedral started Exit Interview even while the signpost pointed at Act II.

## Fix

`q5` now sits between The Audit and Going Up in `QUESTS`. `storyStep` is unchanged, so the rest of its rules stay:

- A quest at “return to the giver” still wins over later districts.
- After Pryce, and before Act II has been entered (`q5 === 3` and `!G.act2`), the objective is still “Act I complete / Take the Transit Gate to The Landing.”
- Going Up is the story objective once that handoff is past and it is the first unfinished quest.

Brenda’s turn-in, the Fields objective, Defrag, Nonce’s Smear offer, and the Act II quests are the same fields they were. Only the table order changed.

## How it was checked

`./build.sh`, then `node tools/smoke.js`: 34/34 zones, no errors.

A phone-viewport page, after `skipDisc` and a Scrapper start, set the quest flags and read both `storyStep()` and the corner objective:

| State | Objective |
|---|---|
| q1–q4 done, q5 still 0, still in town | Exit Interview. Go to The Glass Cathedral and destroy Pryce. |
| Walk into the cathedral | q5 becomes 1. Exit Interview. Destroy Pryce. Follow the arrow. |
| q5 done, Act II not entered | Act I complete. Take the Transit Gate to The Landing. |
| Act II entered, q6 active | Going Up. Go to The Updraft and destroy Foreman Ratchet. |
| q2 waiting on Brenda | A Greeting Withdrawn. Return to Brenda. |
| q1 and q2 done, q3 unspoken | The Last Librarian. Humming Fields / Defrag. |
| q4 waiting on Sister Null | The Audit. Return to Sister Null. |
