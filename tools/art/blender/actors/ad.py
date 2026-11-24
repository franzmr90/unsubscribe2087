"""Siren: the advert that walks. After the drawn one (p3, k==='ad'): a lit screen
on a pole and a tripod, pink BUY flicking to yellow NOW. Built as a four-sided
kiosk so the pitch reads from every one of the eight directions."""
import math
from kit import mat, box, limb, disk, text, hexcol

FRAMES = {'idle': 4, 'walk': 6}
PX = 10; SIZE = 56; FOOT = 0.8
SHADOW = 11
GLOW = [{'y': 31, 'r': 34, 'c': '#e86aa8', 'a': 0.35, 'l': 70}]


def build(sc, root, t, moving):
    frame = mat('frame', hexcol('#17121e'), rough=0.35, metal=0.15)
    wing = mat('wing', hexcol('#6a2d55'), rough=0.5)
    pole = mat('pole', hexcol('#2a2630'), rough=0.4, metal=0.15)
    on = int(t * (6 if moving else 4)) % 2 == 0
    scr = mat('scr_on' if on else 'scr_off', hexcol('#e86aa8' if on else '#ffe36b'), emis=1.3)
    ink = mat('ink', hexcol('#17121e'), rough=0.6)
    ph = t * math.pi * 2
    z = 3.0 + math.sin(ph) * (0.12 if moving else 0.05)
    hop = abs(math.sin(ph)) * 0.15 if moving else 0
    # tripod and pole
    for a in (0, 2.094, 4.189):
        limb(root, (0, 0, 0.8 + hop), (math.cos(a) * 0.8, math.sin(a) * 0.8, 0.05 + hop * 0.3), 0.08, 0.06, pole)
    limb(root, (0, 0, 0.8 + hop), (0, 0, z - 1.0), 0.1, 0.1, pole, False)
    # the kiosk: a dark frame with a lit screen and the word on each face
    box(root, (0, 0, z), (2.3, 2.3, 2.1), frame, 0.12)
    word = 'BUY' if on else 'NOW'
    for i in range(4):
        a = i * math.pi / 2
        cx, cy = math.cos(a) * 1.16, math.sin(a) * 1.16
        box(root, (cx, cy, z), (0.04 if i % 2 == 0 else 2.05, 2.05 if i % 2 == 0 else 0.04, 1.75), scr, 0.03)
        text(root, word, (math.cos(a) * 1.2, math.sin(a) * 1.2, z), 1.0, ink,
             rot=(math.pi / 2, 0, a + math.pi / 2), extrude=0.01)
    # speaker horns under the screen; the drawn art's side wings hid the word in 3D
    for i in range(4):
        a = i * math.pi / 2 + math.pi / 4
        box(root, (math.cos(a) * 1.2, math.sin(a) * 1.2, z - 1.0), (0.45, 0.45, 0.45), wing, 0.15)
    box(root, (0, 0, z + 1.15), (2.45, 2.45, 0.18), frame, 0.06)
