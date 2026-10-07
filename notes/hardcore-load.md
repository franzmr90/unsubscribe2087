# Hardcore does not get back up

Options says a hardcore death deletes the hero. The death screen says there is no portal and the button starts a new wanderer of the same class, still hardcore.

The save that runs when the page hides writes that hero at 0 life. `applySave` then treated every 0-life save the same way: set life to 9999 and drop the cur zone, so the next load stood the dead hardcore hero back up in town with their gear.

A hardcore save at 0 life now takes the death-screen path. The same class begins again at level 1, hardcore stays on, and that new hero is written immediately so a second load does not find the corpse. A softcore 0-life save still wakes in town. The title and the Options list name a fallen hardcore slot instead of offering Continue.
