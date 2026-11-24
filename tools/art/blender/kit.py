"""Small modelling kit for actor scripts: shaded primitives and limbs parented to root."""
import math
import bpy
from mathutils import Vector


def mat(name, col, rough=0.55, metal=0.0, emis=0.0, coat=0.0):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if coat: b.inputs['Coat Weight'].default_value = coat
    if emis:
        b.inputs['Emission Color'].default_value = (*col, 1)
        b.inputs['Emission Strength'].default_value = emis
    return m


def _finish(o, root, m, subdiv=1):
    o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    if subdiv:
        md = o.modifiers.new('sub', 'SUBSURF'); md.levels = md.render_levels = subdiv
    o.parent = root
    return o


def blob(root, loc, r, m, subdiv=1, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=loc, rotation=rot)
    o = bpy.context.active_object; o.scale = r
    return _finish(o, root, m, subdiv)


def limb(root, p0, p1, r0, r1, m, joint=True):
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=r0, radius2=r1, depth=d.length,
                                    location=(p0 + p1) / 2)
    o = bpy.context.active_object
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    _finish(o, root, m, 0)
    if joint: blob(root, p1, (r1, r1, r1), m, 0)
    return o


def hexcol(h, k=1.0):
    """'#rrggbb' -> linear rgb (Blender works in linear light), optionally scaled."""
    h = h.lstrip('#')
    def lin(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(min(1.0, lin(h[i:i + 2]) * k) for i in (0, 2, 4))


def box(root, loc, size, m, bevel=0.12, rot=(0, 0, 0)):
    """A rounded box: loc is the centre, size the full extent on each axis."""
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(m)
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = min(bevel, min(size) * 0.45); md.segments = 3
    for p in o.data.polygons: p.use_smooth = True
    o.parent = root
    return o


def disk(root, loc, r, depth, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object
    return _finish(o, root, m, 0)


def text(root, body, loc, size, m, rot=(math.pi / 2, 0, 0), extrude=0.02):
    """Flat lettering, standing upright and facing -y unless rot says otherwise."""
    bpy.ops.object.text_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.data.body = body; o.data.size = size; o.data.extrude = extrude
    o.data.align_x = 'CENTER'; o.data.align_y = 'CENTER'; o.data.offset = size * 0.05   # bolder strokes
    o.data.materials.append(m); o.parent = root
    o.scale.x = -1      # render.py mirrors the finished image, so letters are cut backwards
    return o


def humanoid(root, t, moving, body, leg, skin, sleeve=None, sz=1.0):
    """The drawn human() in 3D, in units of 10 drawn px: legs 1.3 tall, a 1.6 x 2.0
    torso, a 0.65-radius head at 3.7. Returns the points things are held from."""
    sleeve = sleeve or body
    ph = t * math.pi * 2
    sw = math.sin(ph) if moving else 0
    b = abs(math.cos(ph)) * 0.10 if moving else math.sin(ph) * 0.03
    u = sz
    for s in (1, -1):
        st = sw * s
        hip = (0, s * 0.33 * u, 1.35 * u + b)
        foot = (st * 0.45 * u, s * 0.33 * u, max(0, st) * 0.18 * u + 0.08 * u)
        knee = ((hip[0] + foot[0]) / 2 + 0.10 * u, s * 0.33 * u, (hip[2] + foot[2]) / 2)
        limb(root, hip, knee, 0.24 * u, 0.21 * u, leg)
        limb(root, knee, foot, 0.21 * u, 0.18 * u, leg)
        box(root, (foot[0] + 0.10 * u, foot[1], 0.07 * u), (0.48 * u, 0.30 * u, 0.16 * u), leg, 0.06)
    box(root, (0, 0, 2.2 * u + b), (0.95 * u, 1.55 * u, 1.85 * u), body, 0.3 * u)
    sh = {}
    for s in (1, -1):
        a = -sw * s
        p0 = (0, s * 0.92 * u, 2.85 * u + b)
        el = (a * 0.35 * u, s * 1.0 * u, 2.25 * u + b)
        hand = (a * 0.55 * u + 0.15 * u, s * 1.0 * u, 1.65 * u + b)
        limb(root, p0, el, 0.2 * u, 0.18 * u, sleeve)
        limb(root, el, hand, 0.18 * u, 0.15 * u, sleeve)
        blob(root, hand, (0.17 * u,) * 3, skin, 1)
        sh[s] = hand
    blob(root, (0, 0, 3.15 * u + b), (0.22 * u, 0.22 * u, 0.2 * u), skin, 1)
    head = (0, 0, 3.75 * u + b)
    return {'b': b, 'head': head, 'hand_r': sh[-1], 'hand_l': sh[1], 'sw': sw}
