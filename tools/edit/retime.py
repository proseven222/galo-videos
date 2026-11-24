# uso: python3 retime.py align.json story_draft.json out_story.json
# define a duracao (sec) de cada plano a partir das linhas da narracao (plano k <-> linha k)
import json,sys
A=json.load(open(sys.argv[1],encoding='utf-8')); S=json.load(open(sys.argv[2],encoding='utf-8'))
starts={}
for w,s,e,l in A['words']: starts.setdefault(l,s)
n=len(S['shots']); assert n==len(starts), f"{n} planos mas {len(starts)} linhas de narracao"
DUR=round(A['dur']-0.02,2)
cuts=[round(starts[k]-0.32,3) for k in range(1,n)]
b=[0.0]+cuts+[DUR]
for i,sh in enumerate(S['shots']): sh['sec']=round(b[i+1]-b[i],3)
json.dump(S,open(sys.argv[3],'w'),ensure_ascii=False)
print('planos',[sh['sec'] for sh in S['shots']],'total',round(sum(sh['sec'] for sh in S['shots']),2),'DUR',DUR)
