"""Mediator: Act I's HR figure. After the drawn one (p3, k==='hr'): a teal suit,
a pale mask of a face with a fixed smile, a red tie and a folder held out."""
import math
from kit import mat, box, blob, limb, humanoid, hexcol

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 56; FOOT = 0.8
SHADOW = 12
EXPOSURE = 0.25


def build(sc, root, t, moving):
    suit = mat('suit', hexcol('#7fcdb8'), rough=0.6)
    lapel = mat('lapel', hexcol('#35544c'), rough=0.6)
    leg = mat('leg', hexcol('#2e3a3a'), rough=0.6)
    mask = mat('mask', hexcol('#e8eef0'), rough=0.25, coat=0.6)
    ink = mat('ink', hexcol('#17121e'), rough=0.5)
    tie = mat('tie', hexcol('#b3261e'), rough=0.4)
    paper = mat('paper', hexcol('#f0ead8'), rough=0.8)
    h = humanoid(root, t, moving, suit, leg, mask, sleeve=suit)
    b = h['b']
    # lapels and a shirt front, so the suit reads as a suit
    box(root, (0.47, 0, 2.6 + b), (0.06, 0.55, 0.9), paper, 0.03)
    for s in (1, -1):
        box(root, (0.46, s * 0.33, 2.55 + b), (0.07, 0.22, 1.0), lapel, 0.03, rot=(s * 0.25, 0, 0))
    box(root, (0.52, 0, 2.35 + b), (0.06, 0.2, 0.95), tie, 0.03)
    hx, hy, hz = h['head']
    box(root, (hx, hy, hz), (1.25, 1.35, 1.3), mask, 0.38)
    for s in (1, -1):
        blob(root, (hx + 0.62, s * 0.28, hz + 0.15), (0.06, 0.12, 0.14), ink, 1)
    # the smile: a short arc of dark beads across the front of the mask
    for i in range(7):
        a = -0.9 + i * 0.3
        blob(root, (hx + 0.63, math.sin(a) * 0.36, hz - 0.12 - math.cos(a) * 0.14 + 0.1),
             (0.04, 0.06, 0.05), ink, 0)
    rh = h['hand_r']
    box(root, (rh[0] + 0.35, rh[1] - 0.05, rh[2] + 0.35), (0.7, 0.12, 0.9), paper, 0.04, rot=(0, -0.3, 0.15))
