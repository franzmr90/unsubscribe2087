"""Carrion Drone: a hovering quad with a red eye and two hanging talons. After the
drawn one (p3, k==='drone'): a dark violet body with an amber band, hovering ~28px up."""
import math
from kit import mat, blob, box, disk, limb, hexcol
import bpy

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 52; FOOT = 0.8
EXPOSURE = 0.9
SHADOW = 10
GLOW = [{'y': 27, 'r': 12, 'c': '#ff5d4d', 'a': 0.5}]


def blur_mat():
    m = bpy.data.materials.get('rotor')
    if m: return m
    m = mat('rotor', (0.6, 0.6, 0.7), rough=0.3)
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Alpha'].default_value = 0.16
    return m


def build(sc, root, t, moving):
    c1 = mat('c1', hexcol('#4a4660'), rough=0.35, metal=0.15, coat=0.4)
    c2 = mat('c2', hexcol('#d6a03c'), rough=0.4, metal=0.15)
    dark = mat('dark', hexcol('#2a2630'), rough=0.5, metal=0.15)
    eye = mat('eye', hexcol('#ff5d4d'), emis=4.0)
    rotor = blur_mat()
    ph = t * math.pi * 2
    z = 2.75 + math.sin(ph) * (0.15 if moving else 0.08)
    tilt = 0.12 if moving else 0.0          # nose down when it flies
    blob(root, (0, 0, z), (1.15, 0.95, 0.68), c1, 2, rot=(0, tilt, 0))
    blob(root, (0, 0, z - 0.02), (1.18, 0.98, 0.1), c2, 1, rot=(0, tilt, 0))
    blob(root, (0.82, 0, z - 0.12), (0.26, 0.3, 0.24), dark, 1)
    blob(root, (1.0, 0, z - 0.12), (0.13, 0.15, 0.13), eye, 1)
    for a in (0.785, 2.356, 3.927, 5.498):
        ex, ey = math.cos(a) * 1.55, math.sin(a) * 1.55
        limb(root, (math.cos(a) * 0.6, math.sin(a) * 0.5, z + 0.2), (ex, ey, z + 0.55), 0.1, 0.08, dark)
        disk(root, (ex, ey, z + 0.62), 0.12, 0.2, c2)
        disk(root, (ex, ey, z + 0.75), 0.58, 0.02, rotor)
    # talons hang and swing behind as it flies
    for s in (1, -1):
        k = (-0.35 if moving else -0.1)
        p0 = (0.1 * s, s * 0.28, z - 0.5)
        p1 = (0.1 * s + k, s * 0.4, z - 1.1)
        p2 = (0.1 * s + k * 1.6 + 0.2, s * 0.32, z - 1.5)
        limb(root, p0, p1, 0.09, 0.07, dark)
        limb(root, p1, p2, 0.07, 0.03, dark)
