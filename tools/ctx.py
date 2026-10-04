import re,sys,glob
pat=re.compile(sys.argv[1]);w=int(sys.argv[2]) if len(sys.argv)>2 else 110
for f in sorted(glob.glob('p*.js')):
    for n,l in enumerate(open(f),1):
        for m in pat.finditer(l):
            print(f"{f}:{n}: "+l[max(0,m.start()-w):m.end()+w].replace('\n',''))
