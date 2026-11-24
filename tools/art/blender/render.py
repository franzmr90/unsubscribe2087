"""Pre-rendered 3D -> 2D sprite atlases through Blender (D2's pipeline).

Writes the same albedo atlas, normal atlas and JSON manifest as
tools/art/render-actor.js, so the game cannot tell which one made a sheet:
8 directions across the columns, animation frames down the rows, the model's
z=0 at 62% down each cell, the same top-left key light, and the same dark rim.

  python tools/art/blender/render.py tick            (needs `pip install bpy pillow`)

Actors are Python modules in tools/art/blender/actors/. Each exposes
FRAMES = {'idle': n, 'walk': n}, FIT (model units from the centre to the cell
edge) and build(t, moving), which adds the objects for one frame.
"""
import importlib.util, json, math, os, sys, tempfile
import bpy
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mathutils import Vector
from PIL import Image, ImageOps, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'art', 'out')
SIZE, SCALE, DIRS = 40, 2, 8
S = SIZE * SCALE
ELEV = math.radians(30)
SE, CE = math.sin(ELEV), math.cos(ELEV)
RIM = (0x17, 0x13, 0x1c)


def load_actor(name):
    p = os.path.join(os.path.dirname(__file__), 'actors', name + '.py')
    spec = importlib.util.spec_from_file_location('actor_' + name, p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def setup_render(sc, fit):
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 24
    sc.cycles.use_denoising = False
    sc.render.resolution_x = sc.render.resolution_y = S
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filter_size = 1.0
    sc.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('w'); sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.20, 0.19, 0.24, 1); bg.inputs[1].default_value = 0.22

    # The camera of render-actor.js, which is mirrored: build the real camera with
    # right = -x and flip the finished image, so screen x = model x afterwards.
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = 2 * fit
    cam.shift_y = 0.12                      # z=0 lands 62% down the cell
    co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    view = Vector((0, CE, SE)); up = Vector((0, -SE, CE)); right = Vector((-1, 0, 0))
    from mathutils import Matrix
    m = Matrix((right, up, view)).transposed()
    co.matrix_world = Matrix.Translation(view * 20) @ m.to_4x4()

    # Lights from the camera-space directions render-actor.js uses.
    def cam2world(v):
        sx, sy, d = v
        return (Vector((1, 0, 0)) * sx + up * (-sy) + view * d).normalized()
    def sun(name, v, energy, size):
        l = bpy.data.lights.new(name, 'SUN'); l.energy = energy; l.angle = math.radians(size)
        o = bpy.data.objects.new(name, l); sc.collection.objects.link(o)
        o.rotation_euler = cam2world(v).to_track_quat('Z', 'Y').to_euler()
    sun('key', (-0.55, -0.72, 0.42), 3.0, 6)
    sun('fill', (0.6, 0.3, 0.2), 0.7, 30)
    sun('rim', (0.2, -0.3, -0.9), 1.6, 10)


def normal_material():
    m = bpy.data.materials.new('normals'); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    vt = nt.nodes.new('ShaderNodeVectorTransform'); vt.vector_type = 'NORMAL'
    vt.convert_from = 'WORLD'; vt.convert_to = 'CAMERA'
    nt.links.new(geo.outputs['Normal'], vt.inputs['Vector'])
    # rgb = (-x, y, -z) * .5 + .5: x is negated because the image is flipped after, and
    # z because Blender's camera space looks down +z while the atlas stores toward-viewer as +z.
    mul = nt.nodes.new('ShaderNodeVectorMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = (-0.5, 0.5, -0.5)
    add = nt.nodes.new('ShaderNodeVectorMath'); add.operation = 'ADD'; add.inputs[1].default_value = (0.5, 0.5, 0.5)
    nt.links.new(vt.outputs[0], mul.inputs[0]); nt.links.new(mul.outputs[0], add.inputs[0])
    em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(add.outputs[0], em.inputs[0])
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(em.outputs[0], out.inputs[0])
    return m


def render_to(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return ImageOps.mirror(Image.open(path).convert('RGBA'))


def outline(img):
    a = img.getchannel('A').point(lambda v: 255 if v > 40 else 0)
    o = max(1, round(SCALE))
    grown = Image.new('L', img.size, 0)
    for k in range(8):
        dx = round(math.cos(k * math.pi / 4) * o); dy = round(math.sin(k * math.pi / 4) * o)
        grown = ImageChops.lighter(grown, ImageChops.offset(a, dx, dy))
    rim = Image.new('RGBA', img.size, RIM + (0,)); rim.putalpha(grown)
    rim.alpha_composite(img)
    return rim


def main():
    name = sys.argv[-1] if len(sys.argv) > 1 else 'tick'
    actor = load_actor(name)
    anims = list(actor.FRAMES)
    rows = sum(actor.FRAMES.values())
    sheet = Image.new('RGBA', (DIRS * S, rows * S)); nsheet = Image.new('RGBA', (DIRS * S, rows * S))
    tmp = tempfile.mkdtemp()
    manifest = {'actor': name, 'size': SIZE, 'scale': SCALE, 'dirs': DIRS, 'anims': {}, 'frames': [], 'by': 'blender ' + bpy.app.version_string}
    row = 0
    for anim in anims:
        n = actor.FRAMES[anim]
        manifest['anims'][anim] = {'row': row, 'count': n}
        for f in range(n):
            clear_scene(); sc = bpy.context.scene
            setup_render(sc, actor.FIT)
            root = bpy.data.objects.new('root', None); sc.collection.objects.link(root)
            actor.build(sc, root, f / n, anim == 'walk')
            nmat = normal_material()
            for d in range(DIRS):
                root.rotation_euler = (0, 0, d / DIRS * 2 * math.pi)
                bpy.context.view_layer.material_override = None
                col = render_to(os.path.join(tmp, 'c.png'))
                sheet.paste(outline(col), (d * S, (row + f) * S))
                bpy.context.view_layer.material_override = nmat
                sc.view_settings.view_transform = 'Raw'
                nrm = render_to(os.path.join(tmp, 'n.png'))
                sc.view_settings.view_transform = 'Standard'
                nsheet.paste(nrm, (d * S, (row + f) * S))
                print(f'{name} {anim} {f + 1}/{n} dir {d}', flush=True)
        row += n
    manifest.update(cell=S, cols=DIRS, rows=rows)
    os.makedirs(OUT, exist_ok=True)
    sheet.save(os.path.join(OUT, name + '.png'), optimize=True)
    nsheet.save(os.path.join(OUT, name + '-n.png'), optimize=True)
    with open(os.path.join(OUT, name + '.json'), 'w') as fh: json.dump(manifest, fh, indent=1)
    print(f'{name}: {DIRS}x{rows} cells of {S}px -> art/out/{name}.png')


main()
