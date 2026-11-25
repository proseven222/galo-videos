# Aprendizagens — O Galo Sabe Tudo

## Estilos de gancho (0–3 s) — testar e comparar
- **A · Pergunta chocante**: "Uma padeira matou sete soldados com uma pá?" (título = a 1.ª frase; selo com facto)
- **B · Contador**: número que sobe no ecrã (ex.: 0→400 pessoas) + selo "ISTO ACONTECEU DE VERDADE". Usar só com um número forte na narração.
- **C · Contradição / mito**: "Todo mundo acredita nisto. Está errado." (usar quando a história desfaz um mito)
- **D · Ameaça / quase-catástrofe**: "Isto quase causou uma guerra" (consequência enorme + causa minúscula)
- **E · Origem sombria de objeto comum** (novo, 24/11/2026): "A origem macabra de [objeto do dia a dia]" — só se a narração explicar essa origem. Fonte: FYPNow, formato "Morbid Origin Reveal".
- **F · Pergunta prática de sobrevivência** (novo, 24/11/2026): "Como as pessoas sobreviviam a…?" — só com facto da narração. Fonte: FYPNow, formato "Historical Survival Logistics".
Regras: título de 2 linhas (2.ª em âmbar), selo a partir de 1,45 s, flash + batida no frame 0, zoom de impacto, sem esperar: algo move-se nos primeiros 15 frames.

## Regras de retenção já aplicadas (manter)
- Corte visual a cada ~6–8 s (um por linha da narração) + zoom de impacto no máximo a cada 4,2 s.
- Barra de progresso âmbar; etiquetas de ano/dado; teasers ("O QUE FEZERAM PIOROU TUDO...") antes de reviravoltas e payoffs depois.
- SFX e música sintetizados; voz sempre por cima (sidechain); loudnorm -14.
- CTA de marca no fim: pergunta nos comentários + "Siga para a próxima história improvável!".

## Metas de retenção (realistas) e como medir
- **Gancho:** 70–75 % ou mais ainda a ver aos 3 s (é a meta que controlamos com o gancho).
- **Vídeo todo:** 75 % de conclusão num vídeo de 45–60 s é raríssimo; a meta prática é tempo médio de visualização de 60 % da duração ou mais e conclusão de 35–40 % ou mais. Vídeos de 40–50 s e fecho em loop ajudam (rever conta como retenção).
- Comentários: a pergunta final é parte da retenção. Medir comentários por 1000 visualizações.
- Diário: quando o João partilhar métricas (ou o Buffer as devolver), cruzar o segundo da queda com o plano, etiqueta e som nesse segundo; registar em Repetir / Corrigir / Novo teste.

## Caderno de Regras Ativas (auditoria semanal; a tarefa diária aplica TODAS a cada vídeo novo)
Atualizado em 2026-11-24. Cada regra vem de dados vistos em páginas abertas (fonte e data indicadas) e é adaptada ao kit: sépia, legendas Anton âmbar, marca do galo, CTA e cocorico, narrações intactas. Regras testadas ficam "em teste" até haver métricas do Buffer para comparar.

**R1 · Gancho visual primeiro (clipes/cenas).** O plano 1 mostra "a coisa" (ícone gigante `slam`, objeto, número) nos primeiros 0,5 s, antes de qualquer explicação; sem planos de paisagem vazia no plano 1. Se a história tiver um animal (porco, mula, cobra, galo), o animal é o ícone do `slam`. Porquê: no vídeo n.º 6 do top de outubro da FYPNow (@frontline.history1, 4,1 M views, 7,3 K seguidores, 0:11) o gancho acaba aos 0:03 sem frase falada e há 7 cenas em 11 s; na base de 2,38 M TikToks da Revid (snapshot 15/09/2026) os vídeos "animal" têm mediana 273,2 K e 36,3 % passam 1 M, "faceless" 199,4 K e 29,7 %, "pessoa" 104,8 K e 21,8 % (medianas estimadas por baldes de views, só vídeos que já passaram 1 000 gostos). Onde testar: v11 em diante, comparar tempo médio de visualização com v09/v10.
**R2 · Cadência 2,0 s (edição).** Em todos os vídeos novos pôr `"punch_gap": 2.0` no config.json (o código já o suporta; espaçamento mínimo entre zooms continua 1,8 s). Cada evento novo (zoom, etiqueta, SFX, mudança de câmara) no máximo a cada ~2 s; 2.5 só se o vídeo ficar visualmente cansativo. Porquê: o exemplo da FYPNow muda de cena a cada ~1,6 s, os nossos planos duram ~6–7 s e o único vídeo nosso com métricas (v04, ver Conclusões) teve tempo médio de visualização 7,34 s em 54 s (13,6 %). Evidência fraca (1 vídeo nosso, 1 vídeo externo): é um teste. Onde testar: v11–v14 com 2.0 vs v09/v10 com 3.0.
**R3 · Novos estilos de gancho E e F (texto do gancho).** E · Origem sombria de objeto comum ("A origem macabra de…"; só usar se a narração explicar essa origem); F · Pergunta prática de sobrevivência ("Como as pessoas sobreviviam a…?"). Ambos criam curiosity gap sem inventar factos. Porquê: FYPNow (publicado 02/11/2026) identifica como formatos de outubro o "Morbid Origin Reveal" (barbearia: @angelkitty753, 6,6 M views, 13,9 K seguidores) e "Historical Survival Logistics" (castelos no inverno: @khoidaumoi090, 4,5 M views, 8,4 K seguidores) e recomenda títulos de pergunta prática ou de curiosity gap curto. Aplicar a cada 3 vídeos no A/B de estilos (junto a A–D).
**R4 · Hashtags 9 em vez de 7.** Descrição: manter as 5 fixas (#historia #curiosidades #paravoce #fyp #historiasimprovaveis) + #foryou + #viral + 2 do tema = 9. Porquê: estudo da OpusClip (17/04/2026; 13,5 M clips processados mais uma amostra pública de 1 449 TikToks de 10 nichos, não só história) — vídeos virais têm em média 10,4 hashtags vs 4,8 nos de pior desempenho; mistura nicho+genérica com mediana 527,5 K vs 210 K só nicho. É correlação, estudo de fornecedor: tratar como teste. Onde testar: v11–v14.
**R5 · Som: payoffs com marca sonora (hipótese interna, SEM prova externa).** Não encontrei fonte verificada sobre som nos vídeos virais de história; por isso a regra é um teste pequeno: cada etiqueta `kind:"p"` (revelação) leva um `sfx` `stab` ou `chime` (gain 0.5–0.7) no mesmo instante, e cada `kind:"t"` (teaser) leva um `riser` ~1,2 s antes. Sem mexer na música nem nos loops já definidos. Onde testar: v11–v13; avaliar pelo tempo médio de visualização depois do payoff.


**R6 · O primeiro frame nunca é branco (corrigido no código a 25/11).** Antes, o flash do frame 0 era brilho +0,3 e o título do gancho só aparecia a partir de ~0,1 s: os primeiros 100–200 ms eram um ecrã creme vazio (visto no vídeo 4 e na pré-visualização do TikTok). Agora o flash do frame 0 é +0,07 e o título está visível desde o frame 0 (só faz pop de escala). Verificação obrigatória: extrair fotogramas em 0,0 s e 0,1 s e confirmar que o título do gancho se lê; se o frame 0 estiver claro/vazio, não publicar.
**R7 · Gancho concreto nos primeiros 1,0 s (a maior parte do público decide aos 0:01).** O título nomeia a COISA chocante em palavras simples (animal, objeto, ato, número) e o plano 1 mostra essa coisa em grande desde 0,0 s. Proibido título abstrato/institucional (ex.: "O PARLAMENTO QUASE FUGIU"). Preferir: "O RIO FEDIA TANTO / QUE O PARLAMENTO FUGIU", "UMA PADEIRA MATOU / 7 SOLDADOS COM UMA PÁ?". As primeiras palavras da narração e o título dizem o mesmo.
**R8 · Capa do vídeo.** No `create_post` do Buffer pôr `assets:[{video:{url, metadata:{thumbnailOffset:2000}}}]` (ms) para a capa mostrar o título do gancho e o ícone, em vez do primeiro frame.

## Auditorias semanais
### 2026-11-24 (terça, execução da missão semanal)
Fontes abertas (WebFetch/Apify web-fetch, 24/11/2026): FYPNow "History TikTok Trends: What Went Viral in October 2026" (publicado 02/11/2026, snapshot de 02/11/2026) https://fypnow.com/blog/history-tiktok-trends ; FYPNow tendências desta semana https://fypnow.com/trends/history ; OpusClip https://www.opus.pro/blog/anatomy-of-a-viral-tiktok-2026 (17/04/2026) ; Revid https://www.revid.ai/blog/the-anatomy-of-a-viral-short-2026 (verificado pela Revid em 06/11/2026) ; Virlo https://virlo.ai/trends/2026-11 (sons/trends gerais, sem relevância para história).
Limitações: as páginas do TikTok não abrem por acesso automático (timeout, oEmbed sem legenda), por isso não foi possível ver vídeos, comentários, guardados ou partilhas. Os vídeos abaixo são de outubro (ID do vídeo → data decodificada por mim: 02/10 a 22/10/2026), logo FORA da janela de 7–14 dias pedida; a FYPNow não listou vídeos de história de novembro com métricas. Engajamento = valor "Engagement" da FYPNow (fórmula não indicada; não separa guardados/partilhas/gostos).
| Conta | Views | Seguidores | Views/seg. | Engajamento FYPNow | Data (decod. do ID) | Link |
|---|---|---|---|---|---|---|
| @history.unfilteredtv | 7,8 M | 8,2 K | 959× | 16,5 % | 19/10/2026 | https://www.tiktok.com/@history.unfilteredtv/video/7698226521877613832 |
| @angelkitty753 | 6,6 M | 13,9 K | 478× | 7,3 % | 02/10/2026 | https://www.tiktok.com/@angelkitty753/video/7692073927178308878 |
| @khoidaumoi090 | 4,5 M | 8,4 K | 528× | 2,3 % | 20/10/2026 | https://www.tiktok.com/@khoidaumoi090/video/7698837977350360350 |
| @frontline.history1 (0:11) | 4,1 M | 7,3 K | 558× | 26,3 % | 12/10/2026 | https://www.tiktok.com/@frontline.history1/video/7695888850442325278 |
| @frontline.history1 | 2,2 M | 1,0 K | 2 158× | 19,2 % | 07/10/2026 | https://www.tiktok.com/@frontline.history1/video/7694063435809590559 |
Também no top: @khoi.dan 12,2 M views, 42,9 K seguidores (284×, 20,1 %), edição "comandante" de Napoleão com cortes rápidos e emojis (descrição da FYPNow; não replicar: foge ao nosso visual). Critérios de guardados >1 %, partilhas >0,5 %, gostos >7 %, comentários: NÃO VERIFICADOS.
Padrões (da FYPNow e Revid): contas pequenas com milhões de views; curiosidade histórica específica vence visão geral; faceless; gancho resolvido em <3 s; legenda "curiosity gap" ("Funnest fun fact"); legendas animadas em 96,8 % dos vídeos com legendas (Revid); comprimento quase indiferente na mediana de views (58 K–76 K em todos os baldes, Revid, 176 367 TikToks, out/2025–out/2026), logo não encurtamos o que a narração fixa; vídeos com menos de 40 caracteres de fala tiveram mediana 123 K vs 68 K (Revid), sugerindo deixar o visual contar (R1, R2).
Métricas do canal (Buffer, 24/11/2026 14:28 UTC): ver Conclusões.
Repetição de teste (24/11/2026, pedida pelo utilizador): mesmos números reconfirmados (Buffer: v04 sem alterações, metricsUpdatedAt 14:28 UTC). FYPNow "trends/history" continua sem vídeos de história de novembro com métricas (só "Fake trilateral summit hoax", melhor vídeo 2,1× views/seguidores, 19–20/11, sem contas nem views visíveis, não usado). Único sinal dentro da janela, de outro nicho (Storytelling, FYPNow https://fypnow.com/trends/storytelling, 12–22/11/2026): série "Interactive horror choice series", 6 criadores, 16 vídeos, melhor vídeo 1 461,5× views/seguidores; sem links com conta nem views absolutas. Leitura (inferida, não verificada): séries de escolha incentivam comentários; o nosso CTA já pergunta nos comentários, não se alterou nada.
Código: nenhum ficheiro de `tools/edit/*` alterado. Teste sintético (align.json mínimo + config com `punch_gap` 2.0, `alert_words`, `sfx` chime/riser, `tags` kind p, music tense): `py_compile` OK, `cap.py` e `sfx.py` correram sem erro (zooms em 4,25/6,5/8,3/11,9/14,6 s).

## Experiências (uma linha por vídeo: o que se testa)
- v11 (A Padeira de Aljubarrota, sai 27/11) — BRIEF fixo, decidido a 24/11 com base na auditoria (aplicar R1–R5 e ainda):
  - Gancho estilo A: título = a pergunta da narração ("UMA PADEIRA MATOU / 7 SOLDADOS COM UMA PÁ?"), selo "ALJUBARROTA · 1385", `alert_words`: matou, soldados, pá. Contador opcional 0→7 "SOLDADOS NO FORNO" só se ficar limpo.
  - R1: plano 1 = ícone gigante (`slam`) da pá de forno com o forno, nada de paisagem vazia; o v04 (Parlamento) abriu com cena abstrata e teve 13,6 % de tempo médio de visualização (amostra de 7 h).
  - Objeto próprio: mão com "6 DEDOS" (etiqueta `p` na frase dos seis dedos) e, no fim, dois selos "HEROÍNA" vs "LENDA" a acompanhar a pergunta para forçar voto nos comentários.
  - Honestidade: etiqueta "LENDA · SEM PROVAS" na frase "não há provas históricas" (mantém a narração fiel e alimenta o debate).
  - Som: música `quirky`, `loops` de `crackle` (forno) nas frases do forno, `stab` no payoff "acabou com todos", `chime` em "lenda bem contada". R2: `punch_gap` 2.0. R4: 9 hashtags.
  - Duração ~46 s (boa, 40–50 s); não encurtar a narração.
- v11 PRODUZIDO (25/11): gancho A "UMA PADEIRA MATOU / 7 SOLDADOS COM UMA PÁ?" + selo "ALJUBARROTA 1385", sem contador (7 é pequeno demais). Testa R1, R2 (punch_gap 2.0), R4, R5, R6, R7, R8. Motivo: forno + pá (ícones novos `paforno`, `fornocheio`, `peel`), mão de seis dedos (`hand6`), lupa (`lupa`), selos lado a lado "HEROÍNA?" / "LENDA?" (config `versus`); medalhões que surgem a meio do plano (`pop` no plano da história). Som: quirky, `crackle` no forno. Correção no kit: o objeto do `slam` vê-se desde o frame 0 e o clarão do plano 1 baixou de 0,85 para 0,12 (nos v09c/v10c o fundo do frame 0 ainda saía quase vazio). `finish.sh` agora repete o limitador até o pico verdadeiro ficar ≤ -1 dBTP. Ficha: 46,0 s, -1,5 dBTP, 54 MB.

## Ideias de objetos e sons por tipo de história
- Tempo/duração: relógio, ampulheta e `clocktick` em loop. Medo/doença: `heartbeat`, `cough`. Água/esgoto/rio: `bubbles`, `splash`. Mistério: `pizz` e mood `tense`. Revelação positiva: `chime`. Absurdo/cómico: mood `quirky` e `womp`.
- Vermelho só para perigo/choque (guerra, morte, cólera); datas, números e locais ficam âmbar.

## Resultados (preencher a cada execução com métricas do Buffer)
| Vídeo | Tema | Estilo de gancho | Data | Visualizações | Gostos | Comentários | Partilhas | Notas |
|---|---|---|---|---|---|---|---|---|
| 4 | Fedor de Londres (1858) — edição manual do João, versão anterior | gancho abstrato (Parlamento) | 2026-11-24 | 159 (24 h; 81,3 % Para Ti) | 9 | 0 | 0 | 0 guardados; tempo médio 7,32 s de 54 s (13,6 %); completo 2,9 %; "a maior parte parou aos 0:01"; frame 0 branco |
| 9 | A praga da dança (1518) | B contador | 2026-11-25 | | | | | |
| 10 | A Guerra do Porco (1859) | D ameaça + contador | 2026-11-26 | | | | | |
| 11 | A Padeira de Aljubarrota (lenda, 1385) | A pergunta chocante | 2026-11-27 | | | | | |

## Conclusões e hipóteses
- (2026-11-24, Buffer) Único vídeo "sent" com métricas: v04 "O fedor do rio quase expulsou o Parlamento inglês" (post 6b059f1895f433a0e8528c4c, enviado 24/11 07:42 UTC, métricas atualizadas 14:28 UTC, só ~7 h): 153 views, 9 gostos (5,88 %), 0 comentários, 0 partilhas, tempo médio 7,34 s de 54,0 s (13,6 %), tempo total 23,12 min; "reach" veio 0 (não fiável). Seguidores do canal: não verificado (o Buffer não devolve). Amostra de 1 vídeo e poucas horas: serve só como alerta de que a retenção cai cedo, não como prova. Os vídeos 9 e 10 ainda não saíram (25 e 26/11).
- (2026-11-25, TikTok Studio, 24 h) v04: 159 views, 9 gostos (5,7 %), 0 comentários/partilhas/guardados, tempo médio 7,32 s (13,6 % de 54 s), completo 2,9 %, 0 seguidores novos; origem 81,3 % Para Ti e 18,7 % perfil. A curva de retenção cai a pique logo no início: a maior parte parou aos 0:01. As views vieram em dois picos (1 h e 3 h) e acabaram às ~5 h: o TikTok testou o vídeo num lote pequeno (~150 pessoas), viu retenção fraca e não o expandiu. Diagnóstico: o problema é o 1.º segundo, não o meio nem o fim (quem ficou, quase não saiu: o fim nem foi visto, por isso 0 comentários). Causas prováveis (hipóteses fortes, 1 vídeo): frame 0 branco + título a aparecer depois; gancho abstrato (Parlamento) sem a "coisa" chocante; cena de abertura escura e parada. Correções: R6, R7, R8 e as regras R1/R2 já definidas.
- (2026-11-25 10:24 UTC, Buffer) Sem dados novos: v04 igual (153 views, métricas de 24/11 14:28); v09 e v10 ainda agendados (25/11 e 26/11 às 18:00), sem métricas. Não há base para trocar de estilo: v11 segue o brief (estilo A, diferente do B do v09 e do D do v10, cumpre o A/B).
- Hipótese a testar (R1/R2): abrir com o objeto/animal e subir a cadência de eventos para 2,0 s deve subir o tempo médio de visualização acima dos 13,6 % do v04.
