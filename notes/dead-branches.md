# Branches that carry nothing
The repository held 130 branches. Cursor made one per task and branched each off the
previous one rather than off main, so they are chains, not 130 lines of work. Walking
the chains down to their tips leaves four, and of those only `cursor/all-hands-look-3887`
had anything main did not already have. It is merged.

## The 77 below contribute no source
Each was checked by merging it into `main` (ca5be45) and looking at what changed outside
`dist/`, which is generated:

- **54** merge and change nothing at all.
- **24** conflict, because main rewrote the same lines later. Every one was then
  read line by line against main's source. In each case main holds the same fix or a
  better one -- `hs-wit-feel` leaves a Homesteader form from one skill where main leaves
  it from three; `bid-hold` landed verbatim, comment included, with `reb` spelled
  `rebate`; `skill-vfx-wire` landed as three `keep('form',...)` calls at the point of
  transformation instead of one form check.

Nothing here is unique. Deleting them loses no work.

```sh
# from a clone with push rights
git push origin --delete \
  cursor/act-balance-3941 cursor/act-label-3941 cursor/act1-balance-3941 \
  cursor/act1-replay-3941 cursor/act1-replay2-3941 cursor/ally-leash-3941 \
  cursor/bid-hold-3941 cursor/bounty-pay-3941 cursor/bounty-shown-3941 \
  cursor/buy-all-3941 cursor/c4-scene-cuts-3941 cursor/class-feel-six-3941 \
  cursor/copy-c2-3941 cursor/copy-c3-3941 cursor/copy-c4-3941 \
  cursor/copy-ledger-3941 cursor/credit-pile-3941 cursor/death-portal-3941 \
  cursor/defrag-surge-3941 cursor/eight-class-plan-3941 cursor/exit-interview-obj-3941 \
  cursor/fall-once-3941 cursor/fee-shown-3941 cursor/fill-floor-3941 \
  cursor/float-pledge-3941 cursor/form-toggle-3941 cursor/founder-leash-3941 \
  cursor/fresh-level-3941 cursor/friends-list-m4-3941 cursor/friends-mail-3941 \
  cursor/hardcore-load-3941 cursor/hazard-pay-3941 cursor/hc-fee-3941 \
  cursor/homesteader-m1-3941 cursor/hs-wit-feel-3941 cursor/ines-pay-3941 \
  cursor/loan-floor-3941 cursor/lockbox-floor-3941 cursor/loot-clarity-3941 \
  cursor/mark-floor-3941 cursor/master-rank-3941 cursor/milestone-0-skills-3941 \
  cursor/node-free-3941 cursor/party-m6-3941 cursor/pill-tenths-3941 \
  cursor/playthrough-notes-3941 cursor/post-clear-3941 cursor/price-tag-3941 \
  cursor/pvp-clarity-3941 cursor/quest-variety-3941 cursor/quote-floor-3941 \
  cursor/sell-whole-3941 cursor/sim-nonce-3941 cursor/skill-vfx-copy-plan-3941 \
  cursor/skill-vfx-v1-3941 cursor/skill-vfx-v2-3941 cursor/skill-vfx-v3-3941 \
  cursor/skill-vfx-v4-3941 cursor/skill-vfx-v5-3941 \
  cursor/skills-level-3941 cursor/smear-optin-3941 cursor/social-store-m3-3941 \
  cursor/sold-now-3941 cursor/story-engage-3941 cursor/stray-gift-3941 \
  cursor/sub-bill-3941 cursor/thirty-off-3941 cursor/tooling-coverage-3941 \
  cursor/town-return-3941 cursor/toxic-swing-3941 cursor/twenty-one-armour-3941 \
  cursor/ux-playthrough-3941 cursor/walkthrough-3941 cursor/whispers-m5-3941 \
  cursor/whole-stims-3941 cursor/witness-m2-3941 main
```

## The four tips

| Branch | What is on it | State |
|---|---|---|
| `cursor/all-hands-look-3887` | the cabinet, the StarCraft eggs, item skills, stat requirements, the desk mouse | **merged** -- safe to delete too |
| `cursor/all-hands-3887` | one commit: the plan for the cabinet that -look then built | a design note; keep or drop |
| `cursor/charm-redesign-a113` | one commit: a belt-slot charm redesign note | a design note, not built; keep |
| `cursor/game-text-doc-9067` | an older copy of the text pipeline plus a stale export | superseded; the newer pipeline is merged and `text/` is regenerated |

## Why the counts moved

`git cherry` first reported 73 branches carrying work. It compares patch ids, and every
commit here also rewrites `dist/`, two concatenated 1MB files, so a rebased or
squash-merged commit gets a different id and reads as unlanded. Ignoring `dist/` and
asking whether a merge changes anything is the question that actually matters.

## One that came off this list

`cursor/skill-vfx-wire-3941` was on it and should not have been. `tools/vfx-check`
aside, main carries `tools/vfx-wire-check.js`, which expects skill effect mappings
-- anon 1 as a trail, witness 12 as a patch -- that exist only on that branch. The
check landed and the table it checks did not, so the suite fails on main today and
that branch holds the missing half. **Do not delete it.** Either merge it or port
the SKV table change, then the check passes.

This is also the limit of the method above: a merge into main that changes nothing
proves the branch adds no source, but a branch whose change was *half* taken can
still conflict and still be needed. Everything else on the list was read line by
line against main; this one slipped through because the homesteader half of it did
land, as three keep('form',...) calls, and that is what I checked.
