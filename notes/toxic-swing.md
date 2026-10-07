# Toxic Maximalism attack speed

The card says you attack 15+3×rank percent faster, and so does anybody beside you. The damage half already landed on your own swings through `pdmg`. The speed half set `toxL` on a hireling, a companion, and on you only while you stood in someone else's copy. Your own aura left `toxL` at 0, so `toxicSwing` stayed 1 and the swing interval never moved.

`maxiAura` now sets your `toxL` from your own Toxic aura, the same field the hireling already used. Rank 1 is 18% shorter. Rank 10, read as the printed rank, is 45% shorter. Switching the aura off clears it. A Scrapper does not take the term. The damage half is still +25% at rank 1.

The move-speed flag that was already on while the aura is up is unchanged.
