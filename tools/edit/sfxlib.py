import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf
import json
PJ=json.load(open('punch.json')); DUR=PJ['dur']; N=int(44100*DUR)
SR=44100
rng=np.random.default_rng(77)
L=np.zeros(N); R=np.zeros(N)
def add(sig,t,gain=1.0,pan=0.0):
    i=int(t*SR); 
    if i<0: sig=sig[-i:]; i=0
    n=min(len(sig),N-i)
    if n<=0: return
    gl=gain*np.cos((pan+1)*np.pi/4); gr=gain*np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=sig[:n]*gl; R[i:i+n]+=sig[:n]*gr
def tt(d): return np.arange(int(d*SR))/SR
def env(d,a=0.005,r=None,p=3):
    t=tt(d); r=r or d; e=np.minimum(t/a,1)*np.exp(-t*p/ r*2.2); return e
def lp(x,f,o=2): return sg.sosfilt(sg.butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sg.sosfilt(sg.butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b,o=2): return sg.sosfilt(sg.butter(o,[a,b],'band',fs=SR,output='sos'),x)
def noise(d): return rng.standard_normal(int(d*SR))
def boom(d=1.2,f0=110,f1=38,k=6):
    t=tt(d); ph=2*np.pi*np.cumsum(f1+(f0-f1)*np.exp(-t*k))/SR
    s=np.sin(ph)*np.exp(-t*3.2)*np.minimum(t/0.003,1)
    return s+0.35*lp(noise(d),400)*np.exp(-t*14)
def whoosh(d=0.8,rising=True):
    n=noise(d); t=tt(d); out=np.zeros_like(n); y=0
    fc=(300+5200*(t/d)**2) if rising else (5000-4500*(t/d))
    a=1-np.exp(-2*np.pi*fc/SR)
    for i in range(len(n)): y+=a[i]*(n[i]-y); out[i]=y
    e=np.sin(np.pi*np.clip(t/d,0,1))**1.6
    return hp(out*e,150)*3.0
def tick(f=2100,gain=1):
    d=0.07;t=tt(d); return (np.sin(2*np.pi*f*t)*np.exp(-t*90)+0.5*hp(noise(d),3000)*np.exp(-t*160))*gain
def cannon():
    d=2.2;t=tt(d)
    s=boom(2.2,140,34,9)*1.0+lp(noise(d),900)*np.exp(-t*5)*0.9
    s+=0.5*bp(noise(d),60,300)*np.exp(-t*1.6)*np.minimum(t/0.05,1)
    return s
def explosion():
    d=3.2;t=tt(d); n=noise(d); out=np.zeros_like(n); y=0
    fc=3500*np.exp(-t*2.2)+120; a=1-np.exp(-2*np.pi*fc/SR)
    for i in range(len(n)): y+=a[i]*(n[i]-y); out[i]=y
    s=out*np.exp(-t*1.2)*3.5+boom(d,90,28,4)*1.2
    return s
def splash():
    d=1.3;t=tt(d); s=bp(noise(d),600,5000)*np.exp(-t*7)*np.minimum(t/0.01,1)*1.6
    for k in range(6):
        t0=0.05+k*0.09+rng.random()*0.04; f=500+rng.random()*900
        tb=tt(0.15); s[int(t0*SR):int(t0*SR)+len(tb)]+=np.sin(2*np.pi*(f+f*3*tb)*tb)*np.exp(-tb*28)*0.35
    return s
def bell(f=1318,d=2.4,g=1):
    t=tt(d); s=0
    for m,a in [(1,1),(2.76,.5),(5.4,.25),(8.9,.12)]: s=s+a*np.sin(2*np.pi*f*m*t)*np.exp(-t*(2.2+m*0.9))
    return s*np.minimum(t/0.002,1)*g
def thump(d=0.5,f=70,g=1):
    t=tt(d); return np.sin(2*np.pi*(f+30*np.exp(-t*30))*t)*np.exp(-t*9)*g
def door():
    d=1.0;t=tt(d); return (thump(1.0,55,1.3)+lp(noise(d),700)*np.exp(-t*18)*1.2+hp(noise(d),1500)*np.exp(-t*60)*0.4)
def horn(d=1.6,f=98):
    t=tt(d); s=sum(a*np.sin(2*np.pi*f*m*t+0.3*np.sin(2*np.pi*5*t)) for m,a in [(1,1),(2,.5),(3,.3),(4,.15)])
    return lp(s,1200)*np.minimum(t/0.25,1)*np.exp(-np.maximum(t-0.9,0)*3.5)*0.35
def riser(d=1.5):
    t=tt(d); n=noise(d); out=np.zeros_like(n); y=0; fc=250+7000*(t/d)**2.2; a=1-np.exp(-2*np.pi*fc/SR)
    for i in range(len(n)): y+=a[i]*(n[i]-y); out[i]=y
    tone=np.sin(2*np.pi*np.cumsum(180+1500*(t/d)**2)/SR)*0.25
    return (out*2.2+tone)*(t/d)**1.8
def crackle(d,dens=40):
    s=np.zeros(int(d*SR))
    for _ in range(int(d*dens)):
        i=rng.integers(0,len(s)-400); k=tt(0.006+rng.random()*0.01)
        s[i:i+len(k)]+=rng.standard_normal(len(k))*np.exp(-k*400)*(0.2+rng.random()*0.8)
    return hp(s,800)*0.8
def pop(g=1):
    t=tt(0.18); return np.sin(2*np.pi*(500+700*np.exp(-t*30))*t)*np.exp(-t*24)*g

def emu_call(d=1.0,f=82):
    t=tt(d); am=0.55+0.45*np.sin(2*np.pi*17*t)
    return lp(np.sin(2*np.pi*f*t)*am*np.exp(-t*2.2)*np.minimum(t/0.05,1)+0.3*np.sin(2*np.pi*f*2*t)*am*np.exp(-t*3),600)*1.1
def gun(d=0.25):
    t=tt(d); return (lp(noise(d),3500)*np.exp(-t*38)*1.3+boom(d,170,60,30)*0.9)
def burst(t0,n,rate,g=1.0,pan=0.0):
    for k in range(n): add(gun(0.25),t0+k/rate+rng.random()*0.01,g*(0.8+0.2*rng.random()),pan+(rng.random()-0.5)*0.2)
def clack(g=1.0):
    d=0.08;t=tt(d); return (hp(noise(d),2000)*np.exp(-t*90)*0.9+np.sin(2*np.pi*1100*t)*np.exp(-t*70)*0.4)*g
def step(g=1.0):
    d=0.2;t=tt(d); return (lp(noise(d),500)*np.exp(-t*30)*0.8+np.sin(2*np.pi*70*t)*np.exp(-t*26))*g
def gavel(g=1.0):
    d=0.9;t=tt(d); return (np.sin(2*np.pi*(190+60*np.exp(-t*60))*t)*np.exp(-t*20)*0.7+hp(noise(d),1200)*np.exp(-t*70)*0.6+thump(0.9,60,0.9))*g
def womp():
    d=0.8;t=tt(d); f=np.maximum(330*np.exp(-t*1.6)+90,90); ph=2*np.pi*np.cumsum(f)/SR
    return lp(np.sign(np.sin(ph))*0.35+np.sin(ph)*0.5,1200)*np.exp(-t*1.8)*np.minimum(t/0.03,1)*0.8
def rustle(d=0.6,g=1.0):
    t=tt(d); return bp(noise(d),1800,6500)*np.exp(-t*5)*0.7*g
def press(g=1.0):
    d=0.35;t=tt(d); a=thump(0.2,95,0.9)[:int(.2*SR)]; s=np.zeros(int(d*SR)); s[:len(a)]+=a
    c=clack(0.8); s[int(0.17*SR):int(0.17*SR)+len(c)]+=c; return s*g
def rumble(d,g=1.0):
    t=tt(d); am=0.6+0.4*np.sin(2*np.pi*9*t); n=lp(noise(d),160)*3*am+np.sin(2*np.pi*42*t)*0.6*am
    return n*np.clip(t/0.6,0,1)*np.clip((d-t)/0.6,0,1)*g
def tinkle(t0,d,g=1.0):
    for _ in range(int(d*22)):
        k=tt(0.05); f=3200+rng.random()*3500
        add(np.sin(2*np.pi*f*k)*np.exp(-k*120)*0.35*g, t0+rng.random()*d, 1.0, (rng.random()-0.5)*1.2)

def thunder(d=3.0,g=1.0):
    t=tt(d); n=lp(noise(d),380)*np.exp(-t*1.1)*(0.6+0.4*np.sin(2*np.pi*7*t))*np.minimum(t/0.04,1)
    return (n*3.0+boom(d,70,26,3)*0.8)*g
def crack(g=1.0):
    d=0.5;t=tt(d); return (hp(noise(d),1800)*np.exp(-t*22)*1.4+lp(noise(d),600)*np.exp(-t*8)*0.6)*g
def rain(d,g=1.0):
    t=tt(d); n=bp(noise(d),2500,9000)*0.5+bp(noise(d),600,2000)*0.2
    return n*np.clip(t/1.0,0,1)*np.clip((d-t)/0.8,0,1)*g
def zap(d=1.4,g=1.0):
    t=tt(d); s=hp(noise(d),2500)*(np.sin(2*np.pi*55*t)>0.2)*np.exp(-t*2.5)
    return s*g*0.9

def formant(x,f,bw,g=1.0):
    return bp(x,max(50,f-bw),f+bw,2)*g

