# Character list act

Entering Act IV sets `act4` and also `act3`. Entering Act V sets every earlier flag. The title screen and the Options character list turned that into a number with `act3 ? 3 : act2 ? 2 : 1`, then looked the number up in `['I','II','III']`. An Act IV or Act V hero was labeled Act III.

`heroAct` reads the latest flag. The title rows, the Options rows, and the account summary `ac` all use it. A cloud summary that still says 3 is ignored when the saved hero in that document has a later flag.

Active skill cards were measured against casts in the same pass. Printed damage, duration, cooldown, count, and radius already have a code path. This label was the client bug that did not.
