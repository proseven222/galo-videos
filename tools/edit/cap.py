# uso: python3 cap.py align.json config.json OUTDIR   -> caps.ass, punch.json, fc.txt
import re,json,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from ptnum import merge, norm
A=json.load(open(sys.argv[1],encoding='utf-8')); CFG=json.load(open(sys.argv[2],encoding='utf-8')); OUT=sys.argv[3]
HERE=os.path.dirname(os.path.abspath(__file__))
DUR=round(A['dur']-0.02,2)
words=[tuple(w) for w in A['words']]
words=merge(words)
# cortes = inicio de cada linha (a partir da 2.) menos 0.32 s
starts={}
for w in words: starts.setdefault(w[3],w[1])
CUTS=[round(starts[k]-0.32,3) for k in sorted(starts) if k>=1]
def clean(w): return re.sub(r'[.,:!;…]','',w).upper()
def T(t): return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
# unidades de legenda
units=[]; cur=[]
def flush():
    global cur
    i=0
    while i<len(cur):
        n=min(3,len(cur)-i); rem=len(cur)-i
        if rem==4: n=2
        while n>1 and sum(len(x[0]) for x in cur[i:i+n])+n-1>20: n-=1
        units.append(cur[i:i+n]); i+=n
    cur=[]
for k,w in enumerate(words):
    cur.append(w); nxt=words[k+1][1] if k+1<len(words) else 1e9
    if re.search(r'[.,:?!]$',w[0]) or nxt-w[2]>0.12: flush()
flush()
hdr=open(os.path.join(HERE,'ass_header.txt'),encoding='utf-8').read()
ACT='&H0000C4FF&'; RED='&H003C3CFF&'; ev=[]
ALERT=set(norm(x) for x in CFG.get('alert_words',[]))   # palavras de perigo/choque -> vermelho
isnum=lambda s: re.search(r'\d',s) is not None
for ui,u in enumerate(units):
    nxt=units[ui+1][0][1] if ui+1<len(units) else 1e9
    for k,(w,s,e,ci) in enumerate(u):
        en2=u[k+1][1] if k+1<len(u) else min(e+0.04,nxt)
        parts=[]
        for j,x in enumerate(u):
            c=clean(x[0])
            if isnum(c): c="{\\fs128\\1c"+ACT+"}"+c+"{\\fs104\\1c&HFFFFFF&}"
            col=RED if norm(x[0]) in ALERT else ACT
            parts.append(("{\\1c"+col+"}"+c+"{\\1c&HFFFFFF&}") if j==k and not isnum(c) else c)
        big=isnum(clean(u[k][0]))
        pop="{\\an5\\pos(540,1290)"+("\\fscx82\\fscy82\\t(0,110,\\fscx100\\fscy100)" if k==0 or big else "")+"}"
        ev.append(f"Dialogue: 1,{T(s)},{T(en2)},Cap,,0,0,0,,{pop}{' '.join(parts)}")
# ── GANCHO (0-3.45 s) ──
H=CFG['hook']; S=CFG.get('stamp')
ev.append(f"Dialogue: 2,{T(0.05)},{T(3.45)},Hook,,0,0,0,,{{\\an5\\pos(540,330)\\fscx70\\fscy70\\alpha&HFF&\\t(0,140,\\fscx108\\fscy108\\alpha&H00&)\\t(140,260,\\fscx100\\fscy100)\\fad(0,200)}}{H[0]}\\N{{\\1c{ACT}}}{H[1]}")
if S:
    ev.append(f"Dialogue: 2,{T(1.45)},{T(3.45)},Tag,,0,0,0,,{{\\an5\\pos(540,560)\\frz-3\\fscx60\\fscy60\\t(0,120,\\fscx114\\fscy114)\\t(120,220,\\fscx100\\fscy100)\\fad(0,200)}}  {S[0]}\\N  {S[1]}  ")
C=CFG.get('counter')
if C:
    t=1.55
    while t<2.92:
        x=(t-1.55)/1.35; v=max(1,int(round(C['to']*x**1.8))); nt=min(2.95,t+0.067)
        ev.append(f"Dialogue: 3,{T(t)},{T(nt)},Hook,,0,0,0,,{{\\an5\\pos(540,960)\\fs170\\bord12}}{v}"); t=nt
    ev.append(f"Dialogue: 3,{T(2.95)},{T(3.45)},Hook,,0,0,0,,{{\\an5\\pos(540,960)\\fs170\\bord12\\1c{ACT}\\fscx115\\fscy115\\t(0,120,\\fscx100\\fscy100)\\fad(0,120)}}{C['to']}")
    ev.append(f"Dialogue: 3,{T(1.55)},{T(3.45)},Hook,,0,0,0,,{{\\an5\\pos(540,1100)\\fs72\\bord8\\1c{ACT}\\fad(0,120)}}{C['label']}")
# ── barra de progresso (retenção) ──
ev.append(f"Dialogue: 0,{T(0)},{T(DUR)},Cap,,0,0,0,,{{\\an7\\pos(90,1480)\\p1\\1c&H0A1A2A&\\1a&H70&\\bord0\\shad0}}m 0 0 l 900 0 l 900 12 l 0 12")
ev.append(f"Dialogue: 0,{T(0)},{T(DUR)},Cap,,0,0,0,,{{\\an7\\pos(90,1480)\\p1\\1c{ACT}\\bord0\\shad0\\fscx0\\t(0,{int(DUR*1000)},\\fscx100)}}m 0 0 l 900 0 l 900 12 l 0 12")
def find(word,nth=0):
    ws=[w[1] for w in words if clean(w[0])==clean(word)]
    if len(ws)<=nth: raise SystemExit(f"palavra nao encontrada nas legendas: {word!r} (nth={nth}); alinhadas: {sorted(set(clean(w[0]) for w in words))}")
    return ws[nth]
def at(a):
    if isinstance(a,(int,float)): return float(a)
    return find(a['word'],a.get('nth',0))+a.get('off',-0.05)
TAGS=[]
for tg in CFG.get('tags',[]): TAGS.append((at(tg['at']),tg['text'].replace('\n','\\N  '),tg.get('dur',2.4),tg.get('kind','d')))
# CTA de marca no fim (a partir da palavra "Siga")
if CFG.get('cta_tag',True):
    sg=[w[1] for w in words if clean(w[0])=='SIGA']
    if sg:
        t0=sg[-1]-0.05
        TAGS.append((t0,"SIGA PARA A PRÓXIMA\\N  HISTÓRIA IMPROVÁVEL",DUR-t0,'d'))
TAGS.sort(); shown=[]
for i,(s0,tx,d,k) in enumerate(TAGS):
    e0=s0+d
    if i+1<len(TAGS): e0=min(e0,TAGS[i+1][0]-0.05)
    e0=min(e0,DUR)
    if e0-s0<0.9: print('DROP',tx,round(s0,2),round(e0,2)); continue
    shown.append((s0,k))
    ev.append(f"Dialogue: 2,{T(s0)},{T(e0)},Tag,,0,0,0,,{{\\an5\\pos(540,560)\\fscx60\\fscy60\\t(0,120,\\fscx112\\fscy112)\\t(120,220,\\fscx100\\fscy100)\\fad(0,180)}}  {tx}  ")
    print(f"tag {s0:.2f}-{e0:.2f} {tx!r} {k}")
os.makedirs(OUT,exist_ok=True)
open(os.path.join(OUT,'caps.ass'),'w',encoding='utf-8').write(hdr+"\n".join(ev)+"\n")
# ── zooms (interrupções de padrão, por omissao no maximo 3.0 s entre eles; config punch_gap) ──
key=set(norm(x) for x in CFG.get('keywords',[]))
P=[w[1] for w in words if norm(w[0]) in key]+[s for s,k in shown]
GAP=float(CFG.get('punch_gap',3.0))
allp=sorted(set([3.2]+CUTS+P)); fill=[]; ws_st=[w[1] for w in words]
for _ in range(6):
    allp=sorted(set(allp+fill)); added=False
    for a,b in zip(allp,allp[1:]+[DUR]):
        if b-a>GAP:
            mid=a+(b-a)/2; fill.append(min(ws_st,key=lambda x:abs(x-mid))); added=True
    if not added: break
punch=sorted(set(P+fill)); punch=[p for p in punch if p>3.7 and all(abs(p-c)>0.5 for c in CUTS)]
pr=[]
for p in punch:
    if not pr or p-pr[-1]>=1.8: pr.append(p)
punch=pr
json.dump({'punch':punch,'tags':shown,'cuts':CUTS,'dur':DUR,'counter':bool(C),'words':[(w[0],w[1],w[2]) for w in words],'sfx':CFG.get('sfx',[]),'music':CFG.get('music','dark'),'drums':CFG.get('drums',[]),'loops':CFG.get('loops',[]),'loop_end':CFG.get('loop_end',True)},open(os.path.join(OUT,'punch.json'),'w'))
br="gte(t,0)*0.3*exp(-max(0\\,t-0)*16)+gte(t,1.45)*0.2*exp(-max(0\\,t-1.45)*16)"
for c in CUTS: br+=f"+gte(t,{c})*0.18*exp(-max(0\\,t-{c})*16)"
if CFG.get('loop_end',True): br+=f"+gte(t,{DUR-0.35:.2f})*0.28*(t-{DUR-0.35:.2f})/0.35"   # flash a subir no fim -> liga ao flash do frame 0 (loop)
zz="0.05*exp(-t*6)"+"".join(f"+gte(t,{p:.2f})*0.045*exp(-max(0\\,t-{p:.2f})*7)" for p in punch)
fc=f"""[0:v]scale=w='2*trunc(1080*(1+{zz})/2)':h=-2:eval=frame,crop=1080:1920,eq=brightness='{br}':eval=frame,ass=caps.ass,format=yuv420p[b];
[4:v]scale=170:-1,format=rgba,colorchannelmixer=aa=0.55[wm];
[b][wm]overlay=W-w-44:150[vo];
[1:a]aformat=sample_rates=44100:channel_layouts=stereo,highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=120,apad=whole_dur={DUR},asplit=3[v1][v2][v3];
[2:a]volume=0.8[s];[s][v2]sidechaincompress=threshold=0.03:ratio=3:attack=8:release=300[sd];
[3:a]volume=0.12[m];[m][v3]sidechaincompress=threshold=0.02:ratio=3:attack=20:release=500[md];
[v1][sd][md]amix=inputs=3:weights='1 1 1':normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[a]"""
open(os.path.join(OUT,'fc.txt'),'w').write(fc)
print(len(units),'unidades; cortes',CUTS,'; punch:',[round(p,1) for p in punch],'; DUR',DUR)
