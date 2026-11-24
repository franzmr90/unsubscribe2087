"""Tick: the Act I scuttler. Matches the drawn tick in p3 (drawEnemy, k==='tick'):
a low dark-brown shell about 12px across, four splayed dark legs reaching ~14px
to each side, and an amber eye that flickers red. Modelled with real surfaces:
a glossy ridged carapace, orange seams, a darker belly."""
import math
from kit import mat, blob, limb

FRAMES = {'idle': 4, 'walk': 6}
FIT = 1.6                 # 13.75 screen px per model unit at s=1
SHADOW = 8                # the drawn tick's shadow(X,Y,8*s)
GLOW = [{'y': 8, 'r': 11, 'c': '#ffb84a', 'a': 0.55}]


def build(sc, root, t, moving):
    shell = mat('shell', (0.13, 0.062, 0.02), rough=0.35, coat=0.6)    # #5a3a1c, lifted a touch
    seam = mat('seam', (0.80, 0.24, 0.03), rough=0.5)                  # #e8862e
    under = mat('under', (0.035, 0.02, 0.012), rough=0.8)
    leg = mat('leg', (0.022, 0.019, 0.028), rough=0.45, metal=0.4)     # #2a2630
    # the drawn eye flips between amber and red; the idle frames do the same
    red = (int(t * 4) % 2 == 1) and not moving
    eye = mat('eye_r' if red else 'eye', (1.0, 0.11, 0.07) if red else (1.0, 0.48, 0.07), emis=3.0)
    gait = 1 if moving else 0.18
    bob = math.sin(t * math.pi * 2) * (0.04 if moving else 0.015)
    bz = 0.36 + bob
    blob(root, (0, 0, bz), (0.46, 0.38, 0.22), shell, 2)
    blob(root, (-0.06, 0, bz + 0.08), (0.32, 0.26, 0.15), shell, 2)
    for x in (-0.18, 0.06):
        blob(root, (x, 0, bz + 0.10), (0.016, 0.28, 0.11), seam, 1)
    blob(root, (0, 0, bz - 0.11), (0.42, 0.34, 0.10), under, 1)
    blob(root, (0.40, 0, bz - 0.04), (0.17, 0.16, 0.12), under, 2)
    blob(root, (0.30, 0, bz + 0.17), (0.15, 0.15, 0.13), eye, 2)
    for s in (1, -1):
        limb(root, (0.50, s * 0.07, bz - 0.10), (0.64, s * 0.05, bz - 0.15), 0.028, 0.012, leg, False)
    # legs splay wide and rise above the shell before dropping, like the drawn ones
    hips = [(0.22, 0.26), (-0.14, 0.28), (0.22, -0.26), (-0.14, -0.28)]
    for i, h in enumerate(hips):
        ph = t * math.pi * 2 + (math.pi if i % 2 else 0) + (0.5 if i > 1 else 0)
        swing = math.sin(ph) * 0.20 * gait
        lift = max(0, math.sin(ph)) * 0.12 * gait
        side = 1 if h[1] > 0 else -1
        knee = (h[0] * 1.6 + swing * 0.6, h[1] + side * 0.62, bz + 0.04)
        foot = (h[0] * 2.2 + swing, h[1] + side * 0.98, lift)
        limb(root, (h[0], h[1], bz), knee, 0.055, 0.045, leg)
        limb(root, knee, foot, 0.045, 0.022, leg)
