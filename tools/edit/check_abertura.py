# uso: python3 check_abertura.py align.json config.json   (correr depois do retime.py e antes do render)
# Regras da abertura aprovadas pelo João a 26/11/2026 (RUNBOOK 3.1.1). Sai com codigo 1 se alguma falhar.
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ptnum import merge, norm

A = json.load(open(sys.argv[1], encoding='utf-8'))
CFG = json.load(open(sys.argv[2], encoding='utf-8'))
tm = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), 'timing.json')
if not os.path.exists(tm):
    raise SystemExit('sem timing.json: correr o retime.py primeiro')
TM = json.load(open(tm))
words = merge([tuple(w) for w in A['words']])
starts = {}
for w in words:
    starts.setdefault(w[3], w[1])
cuts = [round(starts[k] - 0.32, 3) for k in sorted(starts) if k >= 1]


def at(a):
    if isinstance(a, (int, float)):
        return float(a)
    clean = lambda s: re.sub(r'[.,:!;…]', '', s).upper()
    ws = [w[1] for w in words if clean(w[0]) == clean(a['word'])]
    n = a.get('nth', 0)
    if len(ws) <= n:
        raise SystemExit(f"palavra nao encontrada: {a['word']!r}")
    return ws[n] + a.get('off', -0.05)


erros = []
# 1) primeiros 3 s: titulo + legenda + no maximo um de (selo, contador)
if CFG.get('stamp') and CFG.get('counter'):
    erros.append('selo e contador no gancho: usar só um (máximo 3 blocos de texto)')
tags = [(at(t['at']), t['text']) for t in CFG.get('tags', [])]
for t, txt in tags + [(at(v['at']), v['text']) for v in CFG.get('versus', [])]:
    if t < 3.45:
        erros.append(f'etiqueta antes dos 3,45 s ({t:.2f} s): {txt!r}')
# 2) entre 3 e 7 s: pelo menos 2 mudancas de imagem
mud = sorted(c for c in cuts + TM.get('subcuts', []) if 3.0 <= c <= 7.0)
if len(mud) < 2:
    erros.append(f'só {len(mud)} mudança(s) de imagem entre 3 e 7 s {mud}: acrescentar "b"/"c" na frase 2')
# 2) selo entre 3,45 e 7 s: tem de haver um, e nao pode ser so a data
DATA = r'(\d+|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|século|ano|de|do|em|a\.?c\.?|d\.?c\.?|[ivxl]+|[·,.\-/])'
cedo = [txt for t, txt in tags if 3.45 <= t < 7.0]
if not cedo:
    erros.append('sem etiqueta de curiosidade entre 3,45 e 7 s')
elif all(all(re.fullmatch(DATA, p) for p in txt.lower().split()) for txt in cedo):
    erros.append(f'as etiquetas entre 3,45 e 7 s só têm a data: {cedo}')

print('mudanças de imagem entre 3 e 7 s:', mud)
print('etiquetas entre 3,45 e 7 s:', cedo)
if erros:
    print('ABERTURA REPROVADA:')
    for e in erros:
        print(' -', e)
    sys.exit(1)
print('ABERTURA OK (confirmar à vista: a "coisa" da história é o objeto central desde 0,0 s)')
