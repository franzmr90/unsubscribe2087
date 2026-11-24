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
