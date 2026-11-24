"""Warden: Act I's heavy. After the drawn one (p3, the default branch at u=1.25):
squat dark legs, a broad slate torso, amber shoulder plates with yellow lamps,
hanging arms and a low head with a red visor."""
import math
from kit import mat, blob, box, limb, hexcol

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 92; FOOT = 0.82
EXPOSURE = 0.9
SHADOW = 26
GLOW = [{'y': 70, 'r': 24, 'c': '#ff3b30', 'a': 0.5}]


def build(sc, root, t, moving):
    c1 = mat('c1', hexcol('#5a6078'), rough=0.35, metal=0.15)
    c2 = mat('c2', hexcol('#d6a03c'), rough=0.35, metal=0.15)
    legm = mat('leg', hexcol('#23202c'), rough=0.5, metal=0.15)
    arm = mat('arm', hexcol('#3a3848'), rough=0.45, metal=0.15)
    head = mat('head', hexcol('#3d4257'), rough=0.35, metal=0.15)
    visor = mat('visor', hexcol('#ff3b30'), emis=4.0)
    lamp = mat('lamp', hexcol('#ffe36b'), emis=3.0)
    root.scale = (1.15, 1.15, 1.15)     # the drawn Warden is u=1.25: a head taller than a person
    ph = t * math.pi * 2
    sw = math.sin(ph) if moving else 0
    b = abs(math.sin(ph)) * 0.15 if moving else math.sin(ph) * 0.04
    for s in (1, -1):
        st = sw * s
        lift = max(0, st) * 0.3
        box(root, (st * 0.5, s * 0.95, 0.9 + lift), (1.2, 1.05, 1.6), legm, 0.15)
        box(root, (st * 0.5 + 0.2, s * 0.95, 0.12 + lift), (1.6, 1.25, 0.26), legm, 0.06)
        box(root, (0, s * 0.95, 1.75 + b), (0.9, 0.9, 0.5), arm, 0.12)
    box(root, (0, 0, 3.4 + b), (2.5, 3.75, 3.4), c1, 0.35)
    box(root, (1.25, 0, 3.4 + b), (0.12, 2.6, 2.2), arm, 0.06)
    for s in (1, -1):
        box(root, (0, s * 2.25, 4.75 + b), (1.5, 1.25, 1.55), c2, 0.25)
        blob(root, (0.55, s * 2.25, 5.4 + b), (0.17, 0.17, 0.17), lamp, 1)
        swing = -sw * s * 0.35
        limb(root, (0, s * 2.3, 4.2 + b), (swing, s * 2.35, 2.9 + b), 0.42, 0.38, arm)
        box(root, (swing + 0.1, s * 2.35, 2.45 + b), (0.95, 0.85, 0.85), arm, 0.18)
    box(root, (0.1, 0, 5.85 + b), (1.6, 2.1, 1.75), head, 0.3)
    box(root, (0.92, 0, 6.05 + b), (0.1, 1.5, 0.36), visor, 0.04)
