# converte numeros por extenso (pt) em algarismos, ao nivel das palavras alinhadas
import re
U={'dois':2,'duas':2,'três':3,'tres':3,'quatro':4,'cinco':5,'seis':6,'sete':7,'oito':8,'nove':9,'dez':10,'onze':11,'doze':12,
'treze':13,'catorze':14,'quatorze':14,'quinze':15,'dezesseis':16,'dezasseis':16,'dezessete':17,'dezassete':17,'dezoito':18,'dezenove':19,
'vinte':20,'trinta':30,'quarenta':40,'cinquenta':50,'sessenta':60,'setenta':70,'oitenta':80,'noventa':90,'cem':100,'cento':100,
'duzentos':200,'duzentas':200,'trezentos':300,'trezentas':300,'quatrocentos':400,'quatrocentas':400,'quinhentos':500,'quinhentas':500,
'seiscentos':600,'seiscentas':600,'setecentos':700,'setecentas':700,'oitocentos':800,'oitocentas':800,'novecentos':900,'novecentas':900,
'mil':1000,'um':1,'uma':1}
def norm(w): return re.sub(r'[.,:?!;…]','',w).lower()
def val(tokens):
    tot=0;cur=0
    for t in tokens:
        v=U.get(t)
        if v is None: continue
        if v==1000: tot+=(cur or 1)*1000; cur=0
        else: cur+=v
    return tot+cur
def merge(words):
    """words: lista de (txt,start,end,line). devolve lista com numeros fundidos."""
    out=[];i=0;n=len(words)
    while i<n:
        t=norm(words[i][0])
        if t in U and t not in ('um','uma'):
            j=i; toks=[t]
            while j+1<n and not re.search(r'[.,:?!;…]$',words[j][0]):
                a=norm(words[j+1][0])
                if a in U: j+=1; toks.append(a); continue
                if a=='e' and j+2<n and norm(words[j+2][0]) in U and norm(words[j][0]) in U \
                   and not re.search(r'[.,:?!]$',words[j][0]) and (U[norm(words[j+2][0])]<U[norm(words[j][0])] or norm(words[j][0])=='mil'):
                    j+=2; toks+=['e',norm(words[j][0])]; continue
                break
            v=val(toks)
            if len(toks)>1 or v>=10:
                tail=re.search(r'[.,:?!;…]*$',words[j][0]).group(0)
                out.append((str(v)+tail,words[i][1],words[j][2],words[i][3])); i=j+1; continue
        out.append(words[i]); i+=1
    return out
if __name__=='__main__':
    T="Quinze de junho de mil oitocentos e cinquenta e nove, em mil e quinhentos, quatrocentos e sessenta e um soldados, dois mil e treze, catorze canhões, sete reis, dez mil, trezentas e setenta léguas, século dezesseis".split()
    print(' '.join(w[0] for w in merge([(x,0,0,0) for x in T])))
