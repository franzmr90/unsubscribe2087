# Act I, and where the next level actually is

A report. Nothing in the game was changed; the prototype that produced the
pictures was reverted and the tree is clean.

## The finding

**Act I does not look flat because of what is drawn. It looks flat because of
how it is lit.** More specifically, because of one line:

```js
drawPlayer(X,Y);
light(X, Y-20, z.town?400:310, null, 1,       2);   /* the player, full strength */
light(X, Y-20, 1150,           null, TX.fill, 2);   /* a fill over the whole view */
```

`src/p3.js`, in the depth list. The player carries a 310px light at **strength
1** and a 1150px fill. The viewport is about 608 units wide. So the player is
standing in the middle of a hole punched clean through the darkness, and almost
everything on screen is inside it.

The consequence is not subtle, and it is measurable. Sampling the floor two
tiles from the player in the Parcel Moors:

| | ambient | fill | floor pixel |
|---|---|---|---|
| as it ships | 0.50 | 0.20 | `59,69,59` |
| ambient way up, fill almost off | **0.80** | **0.03** | `58,67,57` |
| the same, with the player's light at 55% | 0.80 | 0.03 | **`41,48,42`** |

Raising the darkness by 60% and almost deleting the fill changed the floor by
**one value**. Only touching the player's own light moved it. Everything else in
the lighting model is being overwritten before it reaches the screen.

That is why:

- **Lamps cannot light anything.** A lamp can only remove darkness, and near the
  player there is no darkness left to remove. The warm pool a sodium lamp should
  throw does not exist.
- **Deep shadow does not exist.** There is nowhere for light to contrast against,
  so there is no depth, and no sense that the district is dark and the player is
  carrying a light through it.
- **Ambient per zone is nearly decorative.** The `amb` values tuned per district
  (0.42 to 0.72) barely survive the player's own light.

## What it looks like fixed

`.fx-shots/ab-asis.png` and `.fx-shots/ab-lamp.png`: same district, same seed,
same spot. The second has the player's light at 55% of its strength and radius,
ambient at 0.80, fill at 0.03, and an additive light pass.

It is a different game to look at. Each lamp throws a warm pool you can see the
edge of. The dropped item is a light source. The far side of the platform falls
away into dark. The scene has somewhere to walk *into*.

**It also shows the problem to solve:** the player is now standing in relative
shadow, which is a playability question, not a taste one. D2 had exactly this
tension and answered it with a generous personal radius plus actors drawn lighter
than their ground. Our rim-light work from earlier today is the second half of
that answer and already in.

## What I would build, in order

1. **An additive light pass.** The veil only subtracts darkness; this adds the
   lamp's own colour onto the floor, the walls and whatever is standing in it.
   One quarter-res canvas (0.09MB), up to 16 radial fills at 152x152, one
   composite with `lighter`. Essentially free.
2. **Re-balance the player's light against ambient**, as one change, tuned
   together. Lower strength and radius, raise `amb` per district. This is the
   one with gameplay risk and it wants playing, not reasoning: too dark and you
   cannot fight, too bright and nothing above matters.
3. **Light colour per district, used properly.** Act I's sodium orange, the
   Galleria's pink, the Fields' cyan are already in `STY[].glow` and currently
   only tint the veil's edge. With (1) they would actually colour the world.
4. **Ambient occlusion where walls meet floor.** A short dark gradient at wall
   bases. Cheap, and it is most of what makes geometry feel solid.
5. **A wet pass for the Moors.** It rains there. A vertical smear of the lamp's
   colour below each lamp reads as wet asphalt and costs one gradient per lamp.

Nothing on that list needs a byte of downloaded art, a new renderer, or three.js.
Items 1 and 3 together are perhaps forty lines.

## Two process notes from doing this

- **`build.sh` failed and I did not notice for several steps.** My prototype
  declared `const AC`, which collides with the audio context in `src/p2.js`.
  `build.sh` is correct -- `node --check` fails it and it exits 1 -- but my `&&`
  chain stopped at the build while the *next* command I ran by hand used the
  stale `dist/`. Several "prototype" screenshots were the unmodified game, and I
  drew conclusions from them before catching it. When a comparison shows no
  difference, check that the thing under test was built.
- **I measured the build's exit code wrong**, with `./build.sh | tail; echo $?`,
  which reports `tail`'s status. That is what made me briefly believe the build
  was silently passing on an error. It is not.

## Where this leaves the earlier plan

`notes/GRAPHICS-PLAN.md` put "write the readability rules down" first, which is
done, and put pre-rendered art in Tier 3 behind a memory budget. This report does
not change that order so much as insert a rung ahead of all of it: **the lighting
model is the cheapest large win available, and it is in front of the art
question, not behind it.** Pre-rendered actors lit by this lighting model would
look worse than drawn actors lit by a better one.
