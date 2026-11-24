"""Enforcer: the riot-line bot of Act I. After the drawn one (p3, k==='bot'):
a blue-grey human frame, a helmet with a red visor slot, a riot shield carried in
front and a baton held back. Units are ten drawn px."""
import math
from kit import mat, box, limb, humanoid, hexcol

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 56; FOOT = 0.8
EXPOSURE = 0.9
SHADOW = 12
GLOW = [{'y': 38, 'r': 14, 'c': '#ff3b30', 'a': 0.45}]


def build(sc, root, t, moving):
    c1 = mat('c1', hexcol('#7d8ba3'), rough=0.35, metal=0.15)
    c2 = mat('c2', hexcol('#3c4658'), rough=0.5, metal=0.15)
    leg = mat('leg', hexcol('#2a2e3a'), rough=0.6)
    shield = mat('shield', hexcol('#39424f'), rough=0.3, metal=0.15, coat=0.5)
    baton = mat('baton', hexcol('#1c1c22'), rough=0.4)
    visor = mat('visor', hexcol('#ff3b30'), emis=4.0)
    h = humanoid(root, t, moving, c1, leg, c2, sleeve=c2)
    hx, hy, hz = h['head']
    box(root, (hx, hy, hz), (1.3, 1.3, 1.15), c1, 0.3)
    box(root, (hx + 0.6, hy, hz + 0.05), (0.14, 1.0, 0.26), visor, 0.05)
    box(root, (hx - 0.1, hy, hz + 0.62), (1.0, 0.5, 0.18), c2, 0.08)
    # shield on the left forearm, held across the front
    lh = h['hand_l']
    box(root, (lh[0] + 0.55, lh[1] - 0.25, 2.1 + h['b']), (0.14, 1.0, 1.8), shield, 0.1)
    box(root, (lh[0] + 0.63, lh[1] - 0.25, 2.5 + h['b']), (0.04, 0.7, 0.22), c1, 0.02)
    # baton raised a little behind the right hand
    rh = h['hand_r']
    limb(root, rh, (rh[0] - 0.35, rh[1] - 0.2, rh[2] + 1.3), 0.12, 0.1, baton, False)
