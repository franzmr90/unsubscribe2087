"""Small assert-then-replace patcher for src/. Every edit must match exactly once.

Usage from a patch script:
    from patch import P
    p = P('p4.js')
    p.sub('old text', 'new text')        # exactly one occurrence required
    p.after('anchor', 'inserted text')   # insert right after the anchor
    p.save()
"""
import os, sys
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src')

class P:
    def __init__(self, name):
        self.name = name
        self.path = os.path.join(SRC, name)
        with open(self.path, encoding='utf-8') as f:
            self.s = f.read()
        self.n = 0

    def _count(self, old):
        c = self.s.count(old)
        if c != 1:
            raise SystemExit('%s: anchor found %d times (want 1):\n  %r' % (self.name, c, old[:160]))

    def sub(self, old, new):
        self._count(old)
        self.s = self.s.replace(old, new)
        self.n += 1
        return self

    def after(self, anchor, text):
        self._count(anchor)
        self.s = self.s.replace(anchor, anchor + text)
        self.n += 1
        return self

    def before(self, anchor, text):
        self._count(anchor)
        self.s = self.s.replace(anchor, text + anchor)
        self.n += 1
        return self

    def save(self):
        with open(self.path, 'w', encoding='utf-8') as f:
            f.write(self.s)
        print('%s: %d edits' % (self.name, self.n))
