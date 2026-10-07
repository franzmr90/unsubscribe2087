# Hardcore death does not charge a re-onboarding fee

Softcore death subtracts `deathFee()` and the panel prints that amount. Begin again throws the hardcore hero away and `newGame` starts the next wanderer at 120 credits, so the subtracted fee never landed and the printed number was a charge that did not exist.

`deathFee` is 0 while hardcore is on. The panel still has the third stat, and it reads none. Softcore still prints the credit amount, including ₡0 when a cold wallet waives it. That amount is whole credits: the charge is the floor of the rate, which is what the panel shows.
