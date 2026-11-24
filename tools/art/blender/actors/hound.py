"""Repo Hound: a low grey machine dog with a red eye and a red stripe. After the
drawn one (p3, k==='hound'), about 22px long and 24px to the ear."""
import math
from kit import mat, blob, box, limb, hexcol
import bpy

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 48; FOOT = 0.7
EXPOSURE = 1.3
SHADOW = 13
GLOW = [{'y': 23, 'r': 9, 'c': '#ff3b30', 'a': 0.5}]


def build(sc, root, t, moving):
    c1 = mat('c1', hexcol('#5c6470'), rough=0.35, metal=0.15)
    c2 = mat('c2', hexcol('#b23a32'), rough=0.4)
    leg = mat('leg', hexcol('#2a2e36'), rough=0.45, metal=0.15)
    eye = mat('eye', hexcol('#ff3b30'), emis=4.0)
    ph = t * math.pi * 2
    gal = 1 if moving else 0
    b = (abs(math.sin(ph)) * 0.12 if moving else math.sin(ph) * 0.03)
    z = 1.45 + b
    pitch = math.sin(ph) * 0.08 * gal
    box(root, (0, 0, z), (2.3, 0.95, 0.95), c1, 0.35, rot=(0, pitch, 0))
    box(root, (0, 0, z + 0.05), (2.0, 1.0, 0.2), c2, 0.08, rot=(0, pitch, 0))
    box(root, (-0.15, 0, z + 0.5), (1.3, 0.7, 0.18), leg, 0.06, rot=(0, pitch, 0))
    # neck, head, snout, ears
    limb(root, (0.95, 0, z + 0.2), (1.25, 0, z + 0.65), 0.28, 0.24, c1, False)
    box(root, (1.35, 0, z + 0.75), (0.9, 0.75, 0.7), c1, 0.25)
    box(root, (1.85, 0, z + 0.62), (0.55, 0.5, 0.4), leg, 0.15)
    for s in (1, -1):
        limb(root, (1.15, s * 0.25, z + 1.05), (1.0, s * 0.3, z + 1.55), 0.13, 0.02, c1, False)
        blob(root, (1.66, s * 0.26, z + 0.86), (0.09, 0.09, 0.09), eye, 1)
    # tail up and back
    limb(root, (-1.1, 0, z + 0.25), (-1.65, 0, z + 0.95 + math.sin(ph * 2) * 0.1), 0.1, 0.05, leg, False)
    # four legs in a trot: diagonal pairs together
    for (lx, ly, off) in ((0.75, 0.32, 0), (0.75, -0.32, math.pi), (-0.75, 0.32, math.pi), (-0.75, -0.32, 0)):
        sw = math.sin(ph + off) * 0.45 * gal
        lift = max(0, math.sin(ph + off)) * 0.25 * gal
        hip = (lx, ly, z - 0.2)
        knee = (lx + sw * 0.5 + (0.15 if lx < 0 else -0.05), ly, (z - 0.2) * 0.5 + lift * 0.5)
        foot = (lx + sw, ly, lift + 0.06)
        limb(root, hip, knee, 0.17, 0.13, leg)
        limb(root, knee, foot, 0.13, 0.1, leg)
