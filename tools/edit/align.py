import json,re,subprocess,sys
vid=int(sys.argv[1]); nar=sys.argv[2]; NARR=sys.argv[3]; OUT=sys.argv[4]
F=json.load(open(NARR,encoding='utf-8'))[str(vid)]
lines=[re.sub(r'\s+',' ',l.replace('[pause]','').replace('[excited]','')).strip() for l in F.split('\n')]
toks=[];lid=[]
for i,l in enumerate(lines):
    for w in re.findall(r"\S+",l): toks.append(w); lid.append(i)
W=len(toks); wl=[len(re.sub(r'\W','',w))+1.5 for w in toks]
cum=[0]
for x in wl: cum.append(cum[-1]+x)
def expd(j):
    if j==W: return 0
    w=toks[j-1]
    if lid[j]!=lid[j-1]: return 0.55
    if re.search(r'[.?!:]$',w): return 0.4
    if re.search(r',$',w): return 0.2
    return 0.0
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',nar],capture_output=True,text=True).stdout)
out=subprocess.run(['ffmpeg','-hide_banner','-i',nar,'-af','silencedetect=noise=-30dB:d=0.1','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]
en=[(float(a),float(b)) for a,b in re.findall(r'silence_end: ([\d.]+) \| silence_duration: ([\d.]+)',out)]
S=[(s,e[0],e[1]) for s,e in zip(st,en)]
S=[x for x in S if x[0]>0.5 and x[1]<dur-0.05]
END=S[-1][0] if False else None
# trailing silence at file end is not in S (end>=dur-0.05); END = last sound end = last silence start that touches the end
tail=[ (s,e,d) for s,e,d in zip(st,[x[0] for x in en],[x[1] for x in en]) if e>=dur-0.05]
END=tail[0][0] if tail else dur
START=0.05
K=len(S)
def tol(T): return 0.25+0.07*T
def run(r):
    best={(-1,0):(0,None)}
    for k in range(K):
        for j in range(1,W):
            bc=1e18;bp=None
            for (pk,pj),(c,_) in list(best.items()):
                if pk>=k or pj>=j or pk<k-4: continue
                if pk==-1 and k>3: continue
                t0=START if pk==-1 else S[pk][1]; T=S[k][0]-t0
                if T<=0.15: continue
                L=cum[j]-cum[pj]
                c2=c+((T-L/r)/tol(T))**2*2.0+sum(14*S[q][2]**2+0.15 for q in range(pk+1,k))+((S[k][2]-expd(j))/0.25)**2*0.6
                if c2<bc: bc=c2;bp=(pk,pj)
            if bc<1e18: best[(k,j)]=(bc,bp)
    fb=1e18;fk=None
    for (k,j),(c,_) in best.items():
        if k<0 or k<K-4: continue
        T=END-S[k][1]; L=cum[W]-cum[j]
        if T<=0.3: continue
        c2=c+sum(14*S[q][2]**2+0.15 for q in range(k+1,K))+((T-L/r)/tol(T))**2*2.0
        if c2<fb: fb=c2;fk=(k,j)
    path=[];cur=fk
    while cur and cur[0]>=0: path.append(cur); cur=best[cur][1]
    return fb,path[::-1]
res=sorted([(*run(rr)[:1],rr,run(rr)[1]) for rr in (12,13,14,15,16,17,18,19,20,21)],key=lambda x:x[0])
cost,r,path=res[0]; print('r',r,'cost',round(cost,1),[(round(c,1),rr) for c,rr,p in res[:4]])
segs=[];pk=-1;pj=0
for k,j in path+[(None,W)]:
    t0=START if pk==-1 else S[pk][1]; t1=S[k][0] if k is not None else END
    segs.append((t0,t1,pj,j))
    if k is not None: pk,pj=k,j
words=[]
for (a,b,x,y) in segs:
    T=b-a; Lt=cum[y]-cum[x]; t=a
    for i in range(x,y):
        d=T*wl[i]/Lt; words.append((toks[i],round(t,3),round(t+d,3),lid[i])); t+=d
for (a,b,x,y) in segs: print(f"{a:6.2f}-{b:6.2f} L{lid[x]+1} {(cum[y]-cum[x])/(b-a):4.1f} | {' '.join(toks[x:y])}")
json.dump({'lines':lines,'words':words,'dur':dur,'end':END,'silences':S},open(OUT,'w'),ensure_ascii=False)
