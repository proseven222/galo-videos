# uso: python3 retime.py align.json story_draft.json out_story.json
# 1) tempos: plano k <-> linha k da narracao (a voz nunca e alterada)
# 2) cada frase vira 2 planos (ate 4 enquanto um bocado passar de MAXPART s), cortando nas pausas; no plano 1 ha mudanca aos 1,45 s
# 3) medalhoes ("pop") presos a uma palavra entram 2 fotogramas antes dela
# 4) grava timing.json ao lado do align.json (cortes secundarios e reviravolta), lido por cap.py / sfx.py / mix.py
import json,sys,os,copy
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from ptnum import merge, norm
FPS=30; LEAD=2; MINSPLIT=3.6; MAXPART=4.5; HOOKCUT=1.45; EDGE=1.3
A=json.load(open(sys.argv[1],encoding='utf-8')); S=json.load(open(sys.argv[2],encoding='utf-8'))
WORDS=merge([tuple(w) for w in A['words']])
starts={}
for w,s,e,l in A['words']: starts.setdefault(l,s)
n=len(S['shots']); assert n==len(starts), f"{n} planos mas {len(starts)} linhas de narracao"
DUR=round(A['dur']-0.02,2)
B=[0.0]+[round(starts[k]-0.32,3) for k in range(1,n)]+[DUR]
fr=lambda t:int(round(t*FPS))
def find(a,line=None):
    """line=None: em toda a narracao (twist); senao so na frase desse plano, com nth contado dentro dela"""
    pool=[w for w in WORDS if line is None or w[3]==line]
    ws=[w for w in pool if norm(w[0])==norm(a['word'])]
    nth=a.get('nth',0)
    if nth>=len(ws): raise SystemExit(f"palavra nao encontrada: {a['word']!r} (nth={nth}){'' if line is None else f' na frase {line+1}'}; disponiveis: {[norm(w[0]) for w in pool]}")
    return ws[nth]
# reviravolta (opcional): {"twist":{"word":"canta","nth":0}}
TW=None
if S.get('twist'): TW=find(S['twist'])[1]
else: print('AVISO: historia sem "twist" (palavra da reviravolta)')
def blocked(t): return TW is not None and TW-0.8<t<TW+1.2
def pick(a,c):
    """melhor instante de corte dentro de [a,c]: perto do meio, de preferencia numa pausa"""
    mid=(a+c)/2; lo,hi=a+EDGE,c-EDGE
    cand=[(abs(e-0.07-mid)-1.5*d, e-0.07) for s,e,d in A['silences'] if d>=0.15 and lo<=e-0.07<=hi]
    cand+=[(abs(w[1]-0.07-mid)+0.8, w[1]-0.07) for w in WORDS if lo<=w[1]-0.07<=hi]
    free=[x for x in cand if not blocked(x[1])]
    return min(free)[1] if free else None
def autoframe(sh,j):
    """enquadramento automatico quando o plano nao traz "b"/"c" """
    p=sh.get('p',{}); z={1:1.6,2:1.3}.get(j,1.75)
    if sh.get('tpl') in ('interior','landscape') and p.get('actors'):
        a=p['actors'][0]; x=a.get('x0',540)/1080; y=(a.get('y',1550)-a.get('h',500)*0.7)/1920
    else: x,y=0.5,0.45
    if j==2: x=1-x
    return {'frame':{'s':z,'x':round(x,2),'y':round(y,2)}}
shots=[]; subcuts=[]; auto=[]
for k,sh in enumerate(S['shots']):
    a,c=B[k],B[k+1]; alts=[sh.get('b'),sh.get('c'),sh.get('d')]
    cuts=[]
    if alts[0] is not False:
        at=(alts[0] or {}).get('at')
        if at: cuts=[find(at,k)[1]-0.07]
        elif k==0:
            if c-a>=2.4: cuts=[HOOKCUT]
        elif c-a>=MINSPLIT:
            t=pick(a,c)
            if t: cuts=[t]
        # bocados ainda longos -> 3.o e 4.o planos ("c", "d")
        while cuts and len(cuts)<3 and alts[len(cuts)] is not False:
            at=(alts[len(cuts)] or {}).get('at')
            if at: cuts=sorted(cuts+[find(at,k)[1]-0.07]); continue
            bb=[a]+cuts+[c]
            x,y=max(zip(bb,bb[1:]),key=lambda q:q[1]-q[0])
            t=pick(x,y) if y-x>MAXPART else None
            if not t: break
            cuts=sorted(cuts+[t])
    for t in cuts: assert a+0.8<=t<=c-0.8, f"plano {k+1}: corte em {t:.2f}s demasiado perto das pontas ({a:.2f}-{c:.2f}); escolher outra palavra"
    subcuts+=cuts
    bounds=[a]+cuts+[c]; P0=fr(a); PN=fr(c)-P0
    parent={kk:v for kk,v in sh.items() if kk not in ('b','c','pop','sec')}
    parent.setdefault('p',{}); parent['p'].setdefault('seed',S.get('seed',0)+k*7)
    parent.setdefault('compass',0 if k==0 else k%2)
    parts=[]
    for j in range(len(bounds)-1):
        f0,f1=fr(bounds[j]),fr(bounds[j+1])
        alt=None if j==0 else copy.deepcopy(alts[j-1])
        if j and not alt: alt=autoframe(sh,j); auto.append(f"{k+1}{'abcd'[j]}")
        o=copy.deepcopy(parent)
        if j: o.pop('slam',None); o['hook']=False
        own=[]
        if alt:
            alt.pop('at',None); own=alt.pop('pop',[])
            if 'tpl' in alt:      # plano alternativo completo (insert, reacao, outro cenario)
                alt.setdefault('p',{}).setdefault('seed',o['p']['seed']+3*j)
                for key in ('tpl','cam','p'):
                    if key in alt: o[key]=alt[key]
                if 'slam' in alt: o['slam']=alt['slam']
            else:                 # mesmo cenario reenquadrado: animacao e camara continuam
                o['frame']=alt.get('frame') or autoframe(sh,j)['frame']
        if not (alt and 'tpl' in alt): o['f0']=f0-P0; o['fn']=PN
        o['sec']=round((f1-f0)/FPS,5); o['line']=k+1; o['pop']=[]
        parts.append((f0,f1,o,own))
    def place(pp,target=None):
        pp=dict(pp); byword='word' in pp
        if byword:
            w=find(pp,k); wf=fr(w[1]); at=wf-LEAD
            pp.pop('word'); pp.pop('nth',None); pp.pop('t0',None)
        else:
            t0=pp.pop('t0',0)
            if target is None: at=P0+int(round(t0*PN)); wf=at
            else: at=parts[target][0]+int(round(t0*(parts[target][1]-parts[target][0]))); wf=at
        pp.pop('t1',None)
        idx=next((i for i,q in enumerate(parts) if q[0]<=wf<q[1]),None)
        if idx is None: raise SystemExit(f"plano {k+1}: o medalhao {pp.get('n')} calha fora da frase")
        q=parts[idx]; q[2]['pop'].append(dict(pp,f0=max(0,at-q[0])))
        if q[1]-max(at,q[0])<0.6*FPS: print(f"  AVISO: o medalhao {pp.get('n')} fica menos de 0,6 s no ecra (corte logo a seguir); rever a palavra de corte")
        nota=f"{wf-max(at,q[0])} fotogramas antes da palavra" if byword else 'tempo fixo "t0"; preferir "word"'
        print(f"  medalhao {pp.get('n')}: entra aos {max(at,q[0])/FPS:.2f}s ({nota})")
    for pp in sh.get('pop',[]): place(pp)
    for j,q in enumerate(parts):
        for pp in q[3]: place(pp,j)
    shots+=[q[2] for q in parts]
out={kk:v for kk,v in S.items() if kk not in ('shots','twist')}; out['shots']=shots
json.dump(out,open(sys.argv[3],'w'),ensure_ascii=False)
tw=None
if TW is not None:
    t0=round(TW-0.07,3); nxt=min([x for x in sorted(subcuts+B[1:]) if x>TW+0.9]+[DUR])
    tw={'t':t0,'end':round(min(nxt,TW+3.0),3),'cut_at_end':nxt<=TW+3.0}
json.dump({'subcuts':[round(x,3) for x in sorted(subcuts)],'twist':tw},open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])),'timing.json'),'w'))
d=[s['sec'] for s in shots]
print('planos',len(shots),[f"{s['line']}:{s['sec']:.1f}" for s in shots])
print(f"media {sum(d)/len(d):.2f}s  maximo {max(d):.2f}s  total {sum(d):.2f}  DUR {DUR}  reviravolta {tw}")
if auto: print('AVISO: enquadramento automatico (sem "b"/"c") em',auto,'- ver na folha de pre-visualizacao')
if max(d)>5.0: print('AVISO: ha um plano com mais de 5 s; acrescentar "c"/"d" ou escolher outra palavra de corte')
