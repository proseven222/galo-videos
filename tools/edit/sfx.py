# uso: (na pasta de trabalho, com punch.json)  python3 sfx.py   -> sfx.wav, music.wav
import os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *
CUTS=PJ['cuts']
FN={'womp':lambda: womp(),'gavel':lambda: gavel(1.0),'rumble':lambda: rumble(3.0,0.3),'bell':lambda: bell(523,3.0,0.25),'bellhi':lambda: bell(1318,2.4,0.25),
 'belllo':lambda: bell(262,3.0,0.3),'thunder':lambda: thunder(3.0,1.0),'crack':lambda: crack(1.0),'boom':lambda: boom(1.2,100,32),'riser':lambda: riser(1.5)*0.5,
 'pop':lambda: pop(0.8),'horn':lambda: horn(1.4,110),'cannon':lambda: cannon(),'explosion':lambda: explosion(),'splash':lambda: splash(),'door':lambda: door(),
 'zap':lambda: zap(1.4,1.0),'rain':lambda: rain(4.0,0.5),'tinkle':lambda: np.zeros(10),'rustle':lambda: rustle(0.6),'step':lambda: step(1.0),'clack':lambda: clack(1.0),
 'thump':lambda: thump(0.5,70,1.0),'press':lambda: press(1.0),'stab':lambda: stab2(1.0),'emu':lambda: emu_call(1.0,82),'gun':lambda: gun(),'crackle':lambda: crackle(2.0)*0.6,
 'crow':lambda: crow(1.0),'bubbles':lambda: bubbles(1.4,1.0),'cough':lambda: cough(1.0),'clocktick':lambda: clocktick(1.0),'heartbeat':lambda: heartbeat(1.0),'pizz':lambda: pizz(392,1.0),'chime':lambda: chime(1.0)}
def stab2(g=1.0):
    d=1.6;t=tt(d); s=0
    for f in (196,246.9,293.7): s=s+np.sin(2*np.pi*f*t)*np.exp(-t*2.0)
    return lp(s,2000)*np.minimum(t/0.02,1)*0.4*g
t=tt(DUR)
# ambiente de fundo
wind=bp(noise(DUR),200,1400)*(0.5+0.5*np.sin(2*np.pi*0.09*t+2))**1.4
wind*=np.interp(t,np.linspace(0,DUR,9),[0.03,0.05,0.07,0.06,0.08,0.06,0.05,0.04,0])*0.9
add(wind,0,1.0,0)
# música sintetizada (3 ambientes)
M=PJ.get('music','dark')
SET={'tense':dict(bpm=92,chords=[[110.0,130.81,164.81],[87.31,110.0,130.81],[73.42,87.31,110.0],[82.41,103.83,123.47]],drum=1,pluck=1),
     'quirky':dict(bpm=104,chords=[[130.81,164.81,196.0],[98.0,123.47,146.83],[110.0,130.81,164.81],[87.31,110.0,130.81]],drum=0,pluck=1),
     'dark':dict(bpm=72,chords=[[146.83,174.61,220.0],[116.54,146.83,174.61],[98.0,116.54,146.83],[110.0,138.59,164.81]],drum=1,pluck=1),
     'mystic':dict(bpm=60,chords=[[110.0,130.81,164.81],[98.0,123.47,146.83],[87.31,110.0,130.81],[98.0,116.54,146.83]],drum=0,pluck=1),
     'warm':dict(bpm=84,chords=[[130.81,164.81,196.0],[110.0,138.59,164.81],[87.31,110.0,130.81],[98.0,123.47,146.83]],drum=0,pluck=1)}[M if M in ('dark','mystic','warm','tense','quirky') else 'dark']
bpm=SET['bpm']; beat=60/bpm; bar=4*beat; chords=SET['chords']
mus=np.zeros(N); nb=int(DUR/bar)+2
for b in range(nb):
    ch=chords[b%4]; t0=b*bar; d=bar+1.2; k=tt(d); pad=0
    for f in ch:
        for det in (-0.004,0.0,0.004):
            ph=2*np.pi*np.cumsum(np.full(len(k),f*2*(1+det)))/SR
            pad=pad+(2*((ph/(2*np.pi))%1)-1)
    pad=lp(pad,700)/9.0; pad=pad*np.minimum(k/0.9,1)*np.exp(-np.maximum(k-bar,0)*3.0)
    sub=np.sin(2*np.pi*ch[0]*k)*0.6*np.minimum(k/0.5,1)*np.exp(-np.maximum(k-bar,0)*3.0)
    i=int(t0*SR); n=min(len(k),N-i)
    if n>0: mus[i:i+n]+=(pad+sub)[:n]
    if SET['drum']:
        for j in range(4):
            kk=tt(0.5); dr=np.sin(2*np.pi*(52+40*np.exp(-kk*30))*kk)*np.exp(-kk*8)*(0.9 if j==0 else 0.45 if j==2 else 0.0)
            ii=int((t0+j*beat)*SR); nn=min(len(kk),N-ii)
            if nn>0: mus[ii:ii+nn]+=dr[:nn]*0.55
    for j,f in enumerate([ch[0]*4,ch[2]*4,ch[1]*4,ch[2]*4]*2):
        kk=tt(0.9); p=np.sin(2*np.pi*f*kk)*np.exp(-kk*5.5)*0.5+0.2*np.sin(2*np.pi*f*2*kk)*np.exp(-kk*9)
        ii=int((t0+j*beat/2)*SR); nn=min(len(kk),N-ii)
        if nn>0: mus[ii:ii+nn]+=p[:nn]*0.2
ir=rng.standard_normal(int(1.8*SR))*np.exp(-tt(1.8)*2.8); ir[0]=0
wet=sg.fftconvolve(mus,ir,mode='full')[:N]*0.05
mus=(mus+wet); mus*=np.clip(t/2,0,1)*np.clip((DUR-t)/2.5,0,1); mus=mus/np.abs(mus).max()*0.6
wf.write('music.wav',SR,(np.stack([mus,mus*0.97],1)*32767).astype(np.int16))
# ===== GANCHO (0-3.5 s) =====
add(boom(1.8,120,34),0.0,1.0); add(hp(noise(0.5),1800)*np.exp(-tt(0.5)*22),0.0,0.9)
add(horn(1.4,110),0.0,0.7,-0.2); add(whoosh(0.4,False)*0.6,0.0,0.7)
for k in range(6): add(thump(0.35,80,0.9),0.25+k*0.2-0.01*k*k*0.5,1,0.0)
add(whoosh(0.28,False)*0.9,1.38,0.9,0.2); add(crack(1.0),1.45,1.0); add(boom(1.0,150,40,8)*0.9,1.46,1.0)
if PJ.get('counter'):
    tk=1.55; d=0.12
    while tk<2.92: add(tick(1800+int(900*(tk-1.55)),0.5),tk,1,0.1); add(thump(0.3,90,0.5),tk,1,0.0); d=max(0.05,d*0.93); tk+=d
    add(riser(1.2),1.7,0.5)
    add(boom(1.2,100,32),2.95,1.0); add(stab2(1.0),2.95,1.0); add(thump(0.8,60,1.1),2.95,1)
else:
    add(riser(1.5),1.9,0.55); add(boom(1.2,100,32),3.0,0.9); add(stab2(1.0),3.0,0.8)
for i,c in enumerate(CUTS):
    add(whoosh(0.7,True),c-0.45,0.55,-0.4 if i%2 else 0.4); add(boom(0.8,100,40)*0.55,c-0.02,1.0)
for i,p in enumerate(PJ['punch']): add(whoosh(0.35,True)*0.5,p-0.12,0.5,-0.3 if i%2 else 0.3)
for s0,k in PJ['tags']:
    add(thump(0.5,85,0.8),s0,1); add(tick(1500,0.7),s0+0.02,1,0.0)
    if k=='t': add(riser(1.8),s0-0.2,0.5)
    if k=='p': add(crack(1.0),s0,0.9); add(boom(0.9,120,40)*0.7,s0+0.01,1.0)
for dw in PJ.get('drums',[]):            # [{"from":13.4,"to":20}] tambor a acelerar
    tm=dw['from']; gap=0.5
    while tm<dw['to']: add(thump(0.35,75,0.55),tm,1,0.0); gap=max(0.22,gap*0.94); tm+=gap
# motivos repetidos (por video): [{"kind":"clocktick","from":5,"to":12,"every":0.5,"accel":0.97,"min":0.2,"gain":0.5}]
for lp_ in PJ.get('loops',[]):
    f=FN.get(lp_['kind'])
    if f is None: print('loop desconhecido',lp_['kind']); continue
    tm=lp_['from']; gap=lp_.get('every',0.5)
    while tm<lp_['to']:
        add(f(),tm,lp_.get('gain',0.5),0.0); gap=max(lp_.get('min',0.2),gap*lp_.get('accel',1.0)); tm+=gap
# efeitos de momento (do config): [{"at":t,"kind":"womp","gain":0.9}]
for e in PJ.get('sfx',[]):
    f=FN.get(e['kind'])
    if f is None: print('sfx desconhecido',e['kind']); continue
    if e['kind']=='tinkle': tinkle(e['at'],e.get('dur',1.5),e.get('gain',1.0)); continue
    add(f(),e['at'],e.get('gain',0.9),e.get('pan',0.0))
# CTA final: sino + pops
tc=[w[1] for w in PJ['words'] if w[0].upper().startswith('SIGA')]
tc=tc[-1] if tc else DUR-2.5
add(bell(1568,2.4,0.3),tc,1,-0.1); add(crow(0.8),tc+0.55,0.55,0.0); add(pop(0.8),tc+0.05,1,0.2); add(pop(0.7),tc+0.9,1,-0.2); add(boom(1.0,110,38)*0.5,tc,1.0)
# loop: tensao a subir no fim que desagua na batida do frame 0
if PJ.get('loop_end',True): add(riser(0.5)*0.6,DUR-0.55,0.6); add(thump(0.35,80,0.7),DUR-0.06,0.7)
Mx=np.stack([L,R],1); Mx=np.tanh(Mx/2.5)*2.5; pk=np.abs(Mx).max(); Mx=Mx/pk*0.8
wf.write('sfx.wav',SR,(Mx*32767).astype(np.int16)); print('sfx ok',round(pk,2))
