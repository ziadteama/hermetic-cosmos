import random, math, sys
from PIL import Image, ImageDraw, ImageFilter
W, H = int(sys.argv[1]), int(sys.argv[2]); out = sys.argv[3]
S = W / 1920; hz = int(H * 0.56); rnd = random.Random(42)
img = Image.new("RGB", (W, H)); px = img.load()
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
d = ImageDraw.Draw(img)
for y in range(hz):
    t = y / hz; c = lerp((7,6,26),(26,20,64),t/0.7) if t < .7 else lerp((26,20,64),(42,31,85),(t-.7)/.3)
    d.line([(0,y),(W,y)], fill=c)
for y in range(hz, H):
    d.line([(0,y),(W,y)], fill=lerp((17,42,51),(5,8,15),(y-hz)/(H-hz)))
# nebula
neb = Image.new("RGB", (W, H), (0,0,0)); nd = ImageDraw.Draw(neb)
cx, cy, R = W*.68, hz*.35, W*.3
nd.ellipse([cx-R, cy-R*.6, cx+R, cy+R*.6], fill=(60,45,100))
neb = neb.filter(ImageFilter.GaussianBlur(W*.08))
img = Image.composite(Image.blend(img, neb, 0), img, Image.new("L",(W,H),0))
from PIL import ImageChops
img = ImageChops.add(img, neb.point(lambda v: int(v*.55)))
img.paste((0,0,0), [0,hz,W,H], None) if False else None
# redraw water over nebula bleed
d = ImageDraw.Draw(img)
for y in range(hz, H):
    d.line([(0,y),(W,y)], fill=lerp((17,42,51),(5,8,15),(y-hz)/(H-hz)))
layer = Image.new("RGBA", (W, H), (0,0,0,0)); L = ImageDraw.Draw(layer)
for _ in range(int(W*hz/900/S)):
    x = rnd.random()*W; y = (rnd.random()**1.3)*hz*.95; s = (rnd.random()*1.4+.4)*S; a = rnd.random()*.7+.3
    gold = rnd.random() < .1
    col = (212,175,55) if gold else (236,230,214)
    L.ellipse([x, y, x+s, y+s], fill=col+(int(255*a),))
    ry = hz + (hz-y)*.85; rc = (79,179,169) if gold else (192,200,216)
    L.rectangle([x, ry, x+s*1.6, ry+max(1,s*.5)], fill=rc+(int(255*a*(.4 if gold else .22)),))
# moon
mx, my, mr = W*.22, hz*.3, W*.018
L.ellipse([mx-mr,my-mr,mx+mr,my+mr], fill=(192,200,216,255))
L.ellipse([mx-mr*.45,my-mr*1.05,mx+mr*1.35,my+mr*.75], fill=(0,0,0,0))
for k in range(9):
    yy = hz + (hz-my)*.85 + k*4*S - 14*S
    L.rectangle([mx-mr*(1-k*.06), yy, mx-mr*(1-k*.06)+mr*1.4*(1-k*.06), yy+1.5*S], fill=(192,200,216,int(255*(.22-k*.022))))
img = Image.alpha_composite(img.convert("RGBA"), layer)
# crescent cut: repaint sky colour inside the cut circle
cut = Image.new("L",(W,H),0); ImageDraw.Draw(cut).ellipse([mx-mr*.45,my-mr*1.05,mx+mr*1.35,my+mr*.75], fill=255)
moon = Image.new("L",(W,H),0); ImageDraw.Draw(moon).ellipse([mx-mr,my-mr,mx+mr,my+mr], fill=255)
mask = ImageChops.multiply(cut, moon)
img.paste((26,21,60,255), mask=mask)
# glow layer: horizon + hexagram
g = Image.new("RGBA",(W,H),(0,0,0,0)); G = ImageDraw.Draw(g)
for x in range(W):
    a = max(0, 1-abs(x-W/2)/(W/2)); G.point((x,hz), fill=(212,175,55,int(230*a)))
cx, R, lw = W/2, H*.2, max(2, int(2*S))
up = [(cx,hz-R),(cx+R*.866,hz+R*.5),(cx-R*.866,hz+R*.5)]
dn = [(cx,hz+R),(cx+R*.866,hz-R*.5),(cx-R*.866,hz-R*.5)]
G.line(up+[up[0]], fill=(212,175,55,235), width=lw, joint="curve")
G.line(dn+[dn[0]], fill=(79,179,169,220), width=lw, joint="curve")
r2 = R*1.12; G.ellipse([cx-r2,hz-r2,cx+r2,hz+r2], outline=(236,230,214,46), width=max(1,lw//2))
dot = max(3, R*.05); G.ellipse([cx-dot,hz-dot,cx+dot,hz+dot], fill=(212,175,55,245))
glow = g.filter(ImageFilter.GaussianBlur(10*S))
img = Image.alpha_composite(img, glow); img = Image.alpha_composite(img, g)
# ripples
rp = Image.new("RGBA",(W,H),(0,0,0,0)); RP = ImageDraw.Draw(rp)
for _ in range(60):
    yy = hz+6*S+rnd.random()*(H-hz-6*S); ww = rnd.random()*W*.12+10*S; x0 = rnd.random()*W
    RP.rectangle([x0,yy,x0+ww,yy+max(1,S)], fill=(127,209,200,int(255*(.04+rnd.random()*.06))))
img = Image.alpha_composite(img, rp)
img.convert("RGB").save(out, optimize=True); print("saved", out)
