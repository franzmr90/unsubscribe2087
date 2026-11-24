"""Tick: the Act I scuttler. Same proportions and gait as render-actor.js's tick,
modelled with real surfaces: a ridged carapace, a darker belly, a glowing eye."""
import math
from kit import mat, blob, limb

FRAMES = {'idle': 4, 'walk': 6}
FIT = 1.25


def build(sc, root, t, moving):
    shell = mat('shell', (0.70, 0.22, 0.025), rough=0.42, coat=0.25)    # #e8862e in linear
    under = mat('under', (0.10, 0.042, 0.012), rough=0.7)              # #5a3a1c
    leg = mat('leg', (0.15, 0.09, 0.055), rough=0.45, metal=0.5)
    eye = mat('eye', (1.0, 0.55, 0.12), emis=2.2)
    gait = 1 if moving else 0.18
    bob = math.sin(t * math.pi * 2) * (0.045 if moving else 0.018)
    bz = 0.34 + bob
    blob(root, (0, 0, bz), (0.50, 0.40, 0.21), shell, 2)
    blob(root, (-0.08, 0, bz + 0.07), (0.34, 0.27, 0.15), shell, 2)
    # segment seams: thin dark bands across the back
    for x in (-0.20, 0.04):
        blob(root, (x, 0, bz + 0.085), (0.018, 0.29, 0.10), under, 1)
    blob(root, (0, 0, bz - 0.10), (0.44, 0.35, 0.10), under, 1)
    blob(root, (0.44, 0, bz - 0.05), (0.19, 0.17, 0.13), under, 2)
    blob(root, (0.56, 0, bz + 0.01), (0.115, 0.115, 0.115), eye, 1)
    # mandibles
    for s in (1, -1):
        limb(root, (0.55, s * 0.08, bz - 0.10), (0.70, s * 0.05, bz - 0.14), 0.03, 0.012, leg, False)
    hips = [(0.26, 0.26), (-0.14, 0.30), (0.26, -0.26), (-0.14, -0.30)]
    for i, h in enumerate(hips):
        ph = t * math.pi * 2 + (math.pi if i % 2 else 0) + (0.5 if i > 1 else 0)
        swing = math.sin(ph) * 0.20 * gait
        lift = max(0, math.sin(ph)) * 0.13 * gait
        side = 1 if h[1] > 0 else -1
        knee = (h[0] + swing * 0.6, h[1] + side * 0.50, bz * 0.52)
        foot = (h[0] + swing, h[1] + side * 0.60, lift)
        limb(root, (h[0], h[1], bz - 0.02), knee, 0.075, 0.060, leg)
        limb(root, knee, foot, 0.060, 0.030, leg)
