# uso: (na pasta de trabalho, com punch.json, nar.mp3, sfx.wav, music.wav)  python3 mix.py  -> mix.wav, levels.json
# Mistura com niveis medidos em relacao a voz (a loudness final e feita depois, no finish.sh):
#   - picos dos efeitos <= 0,7x o pico da voz
#   - enquanto a voz fala, os efeitos ficam abaixo dela (mais ainda no gancho)
#   - musica ~11 dB abaixo da voz quando ela fala, um pouco mais alta nas pausas
#   - na reviravolta a musica para
import json,subprocess,sys
import numpy as np, scipy.io.wavfile as wf
from scipy.ndimage import minimum_filter1d, uniform_filter1d, maximum_filter1d
SR=44100; PJ=json.load(open('punch.json')); DUR=PJ['dur']; N=int(SR*DUR)
PEAK_RATIO=0.70; HOOK_END=3.0; SFX_UNDER_HOOK=-5.0; SFX_UNDER=-6.0; MUS_SPEECH=-11.0; MUS_PAUSE=-8.0
db=lambda a:20*np.log10(max(float(a),1e-9)); lin=lambda d:10**(d/20)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i','nar.mp3','-af',
  f'aformat=sample_rates={SR}:channel_layouts=stereo,highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=120,apad=whole_dur={DUR}',
  '-t',str(DUR),'-c:a','pcm_f32le','voice.wav'],check=True)
def load(f):
    sr,x=wf.read(f); assert sr==SR, f"{f}: {sr} Hz"
    x=x.astype(np.float64)/(32768.0 if x.dtype==np.int16 else 1.0)
    if x.ndim==1: x=np.stack([x,x],1)
    y=np.zeros((N,2)); m=min(N,len(x)); y[:m]=x[:m]; return y
V,S,M=load('voice.wav'),load('sfx.wav'),load('music.wav')
def rms_env(x,win=0.05): return np.sqrt(np.maximum(uniform_filter1d((x**2).mean(1),int(win*SR),mode='constant'),0))
ev=rms_env(V); loud=ev[ev>lin(-45)]; vref=np.sqrt(np.mean(loud**2))
speech=ev>vref*lin(-15)                                   # amostras com voz
talk=maximum_filter1d(speech.astype(float),int(0.30*SR))  # com 150 ms de folga, para nao "bombar" entre palavras
talk=uniform_filter1d(talk,int(0.20*SR))
def grms(x,mask): return np.sqrt(np.mean((x[mask]**2)))
t=np.arange(N)/SR
# ── efeitos ──
S*=0.8
es=rms_env(S)
under=np.where(t<HOOK_END,lin(SFX_UNDER_HOOK),lin(SFX_UNDER))
need=np.where(talk>0.5,np.minimum(1.0,vref*under/np.maximum(es,1e-9)),1.0)
g=minimum_filter1d(need,int(0.12*SR)); g=uniform_filter1d(g,int(0.10*SR))
S*=g[:,None]
ceil=PEAK_RATIO*np.abs(V).max()*0.995
req=np.minimum(1.0,ceil/np.maximum(np.abs(S).max(1),1e-9)); L=int(0.05*SR)
gl=uniform_filter1d(minimum_filter1d(req,2*L+1),L)
S*=gl[:,None]; S=np.clip(S,-ceil,ceil)
# ── musica ──
base=vref/max(grms(M,speech),1e-9)
gm=base*(lin(MUS_PAUSE)+(lin(MUS_SPEECH)-lin(MUS_PAUSE))*talk)
TW=PJ.get('twist')
if TW:   # a musica para 0,4 s antes e volta 1,2 s depois
    a=TW['t']
    gm=gm*np.interp(t,[0,a-0.45,a-0.33,a+1.2,a+1.8,DUR+1],[1,1,0,0,1,1])
M*=gm[:,None]
mix=V+S+M
pk=np.abs(mix).max()
if pk>0.98: mix*=0.98/pk
wf.write('mix.wav',SR,mix.astype(np.float32))
# ── relatorio ──
hook=speech&(t<1.4)
R={'sfx_peak_vs_voz':round(float(np.abs(S).max()/np.abs(V).max()),2),
   'sfx_vs_voz_gancho_dB':round(db(grms(S,hook))-db(grms(V,hook)),1),
   'sfx_vs_voz_fala_dB':round(db(grms(S,speech))-db(grms(V,speech)),1),
   'musica_vs_voz_fala_dB':round(db(grms(M,speech&((t<(TW['t']-0.5))|(t>(TW['t']+1.9)) if TW else t>=0)))-db(grms(V,speech)),1),
   'reviravolta':None}
if TW:
    w=(t>=TW['t']-0.3)&(t<TW['t']+1.1)
    R['reviravolta']={'t':TW['t'],'musica_vs_voz_dB':round(db(grms(M,w))-db(vref),1)}
bad=[]
if R['sfx_peak_vs_voz']>0.71: bad.append('picos dos efeitos acima de 0,7x a voz')
if R['sfx_vs_voz_gancho_dB']>-3.0: bad.append('efeitos tapam a voz no gancho')
if not -13.0<=R['musica_vs_voz_fala_dB']<=-9.0: bad.append('musica fora de -13..-9 dB face a voz')
R['ok']=not bad; json.dump(R,open('levels.json','w'))
print('niveis:',json.dumps(R,ensure_ascii=False))
if bad: sys.exit('MISTURA REPROVADA: '+'; '.join(bad))
