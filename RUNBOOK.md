# RUNBOOK — vídeo diário "O Galo Sabe Tudo" (série "Histórias Improváveis")

Objetivo: **1 vídeo por dia, publicado no TikTok às 18:00 (Europe/Lisbon)**, com narração, edição de retenção e descrição, melhorando o gancho com base nos resultados.
Conversa com o utilizador em **PT-PT**. Vídeo, legendas e descrição em **PT-BR**. Nunca perguntar nada: esta tarefa corre sem ninguém. Se algo falhar, registar em `state.json` (`errors`) e terminar com um resumo claro.

## 0. Regras que nunca mudam
- Estilo: mapa antigo, tinta sépia sobre pergaminho; figuras sem rosto; sem texto legível dentro das cenas; logótipo do galo como marca de água (feito pelo `finish.sh`).
- Narração: **já gerada** (ElevenLabs, voz Will) em `audio/vNN.mp3`; texto em `scripts/narr_final.json` (chave = número do vídeo). **Não gerar narrações novas** (créditos limitados). Cada narração começa com `[excited]` e acaba com comentário + `Siga para a próxima história improvável!`.
- Factos: gancho, selos e etiquetas só com factos que estão na narração. Nunca inventar números nem datas.
- Antes de publicar: lembrar na descrição "⚠️ Vídeo feito com IA." e ativar `isAiGenerated`.
- Um vídeo agendado fica sempre **pelo menos ~1 dia à frente**, para o utilizador o poder rever no Buffer e apagar.

## 1. Preparação (sessão nova)
1. `add_repo` `proseven222/galo-videos` com `access: push`, clonar para `/home/claude/galo-videos` (clone raso, timeout longo) e `register_repo_root`.
2. `bash tools/setup.sh` (copia o kit para `/home/claude/kit`, que é o caminho fixo usado pelos scripts).
3. Ler `state.json` e `learnings.md`, incluindo o **"Caderno de Regras Ativas"** (R1–R5, atualizado pela auditoria semanal de domingo): aplica-as todas ao vídeo do dia (ver 3.1, 3.3, 3.5 e 4.3) e regista em "Experiências" que regras estás a testar.

## 2. Ler resultados e aprender (se houver posts publicados)
- Buffer: `get_account` (organização), `list_posts` com `status:["sent"]`, `includeMetrics:true`, canal `6b059f178541f09ecb8a802e` (TikTok `ogalosabetudo`). Se as métricas não vierem (falta de permissão), registar isso e seguir.
- O Caderno de Regras Ativas tem no máximo 5 regras; a tarefa diária não acrescenta regras ativas novas (correções técnicas vão para este RUNBOOK, ideias para "Experiências"; a auditoria semanal de domingo só apresenta propostas; o Caderno só muda depois de o João concordar).
- Atualizar a tabela em `learnings.md` (vídeo, estilo de gancho, visualizações, gostos, comentários, partilhas, retenção se existir) e escrever 2–3 linhas de conclusão: que estilo de gancho/overlay funcionou melhor.
- Escolher o estilo de gancho do vídeo de hoje: usar o que está a ganhar, mas **a cada 3 vídeos testar um estilo diferente** (A/B). Estilos em `learnings.md`.
- Uma vez por semana (segunda-feira): fazer 2–3 `WebSearch` sobre ganchos que estão a funcionar em TikTok de história/curiosidades (PT-BR) e anotar o que adaptar.

**Acordo com o João (26/11/2026): analisar primeiro, mudar depois.** O João envia as métricas de cada vídeo 24 h depois de sair. Analisa-se o que correu bem ou mal e porquê, e só depois se decide **com ele** o que muda e se vale a pena. A tarefa diária aplica o que já está aprovado (incluindo a alternância de estilos de gancho) e regista ideias novas em `learnings.md` como propostas, sem alterar regras, RUNBOOK ou código por iniciativa própria (exceção: corrigir erros que impeçam ou estraguem a produção, avisando no resumo).

## 3. Produzir o vídeo N (N = `state.next_video`)
Pasta de trabalho: `W=/home/claude/work/vNN` (NN com 2 dígitos).
```
mkdir -p $W && cp audio/vNN.mp3 $W/nar.mp3
python3 tools/edit/align.py N audio/vNN.mp3 scripts/narr_final.json $W/align.json   # sincroniza o texto com a voz (sem ASR)
```
Ver o resultado: 8 linhas L1..L8; cada pausa deve cair onde há pontuação. Se o custo for muito alto (>40) ou faltarem linhas, rever.

### 3.1 História visual (8 entradas = 8 linhas da narração, cada uma com 2 planos ou mais)
Escrever `$W/story_draft.json` com `{"seed":N*10+1,"twist":{"word":"..."},"shots":[...]}`; cada entrada corresponde à linha de narração com o mesmo número (entrada 1 = frase-gancho, entrada 8 = pergunta + CTA). Os tempos (`sec`) são calculados por `retime.py`, por isso põe `"sec":1`. A voz nunca é cortada nem acelerada.

**Dois planos por frase (aprovado pelo João a 25/11/2026).** A entrada é o plano A; `"b"` é o 2.º plano (e `"c"`, `"d"` os seguintes, por ordem no tempo, nas frases longas: o `retime.py` cria-os enquanto um bocado passar de 4,5 s). O corte cai numa pausa perto do meio; para o prender a uma palavra: `"b":{"at":{"word":"forno"},...}` (`word`/`nth` contam só dentro dessa frase). Na frase 1 a mudança é aos 1,45 s (junto com o selo). `b` pode ser:
- outro plano completo (`tpl`, `cam`, `p`): detalhe/insert (`closeup`), reação, plano geral, mapa. Preferir isto: mostra cada ideia da frase a acontecer.
- o mesmo cenário reenquadrado: `"b":{"frame":{"s":1.7,"x":0.27,"y":0.55}}` (`s` = aproximação ≥1; `x`,`y` = ponto do ecrã, 0–1, que fica no centro). A animação e a câmara continuam.
- sem `b`: enquadramento automático (o script avisa; confirmar na folha). `"b":false` mantém um só plano (evitar).
Variar o tamanho: geral → grande plano → detalhe → reação. Ao reenquadrar, o assunto não pode ficar atrás da legenda (y≈0,67) nem das etiquetas (y≈0,29), nem cortado na borda.

**Medalhões presos à palavra:** `"pop":[{"n":"hand6","word":"seis","y":0.47,"r":300}]` entra 2 fotogramas antes da palavra (não usar `t0`).

**Reviravolta (obrigatório):** `"twist":{"word":"acabou"}` = a palavra do momento alto (`nth` conta em toda a narração; nunca na frase 1 nem no CTA). A música pára 0,4 s antes, entra uma batida grave e a câmara aproxima; o plano que começa aí deve mostrar a ação (pôr `b`/`c` com `"at"` nessa palavra, se der). Se houver uma etiqueta `p` nesse instante, o `sfx` da R5 mantém-se.
```
python3 tools/edit/retime.py $W/align.json $W/story_draft.json /home/claude/kit/stories/vNN.json
```
Exemplo no formato atual: `tools/examples/v11/story_draft_2planos.json` (os mais antigos só têm um plano por frase). Vocabulário:
- Plano 1 leva `"slam":"<ícone>"` (carimbo gigante do ícone no gancho). **R1:** o plano 1 mostra "a coisa" (objeto/animal/número) logo no início, nunca paisagem vazia; se a história tem um animal (pig, mule, snake, rooster), esse animal é o ícone do `slam` e do `closeup` do plano 1.
- `tpl`: `landscape` (céu/terreno, `actors`, `props`, `banners`, `birds`, `fire`, `rain`, `snow`, `smoke`...), `interior` (`kind`:hall/archive..., `table`, `items`, `actors`, `fore`), `closeup` (`icons`:[{n,x,y,s}], `below` atores), `map` (`land`:[{n:"island",x,y,w,h}], `pins`, `routes`, `waves`, `dots`), `sea`, `tunnel`.
- `cam`: push, pull, panL, panR, tiltUp, tiltDown, orbit, drift. Alternar câmaras e templates entre planos seguidos.
- `tod`: day, dusk, night, gold, grey, storm, dawn, fire. `sky`: castle, city, dunes, forest, huts, jungle, monastery, mountains, port, ruins, tower, village, volcano, plain. `gnd`: sand, mud, stone...
- Atores `type`: woman, man, top, scholar, soldier, knight, king, monk, priest, wizard, pilgrim, sailor, hood. `mode`: idle, march, run, cheer, up, dance, cough, fan, kneel, point, look, shade, wave. Props de ator: spear, scroll, banner...
- Ícones (`slam`, `icons[].n`, `props` `{t:"icon",n:...}`): anchor, bell, book, bread, candle, cannon, castle, clock, coins, crown, gallows, globe, hourglass, key, lantern, moon, mule, pig, plane, question, quill, ring, rooster, scroll, ship, shoe, shovel, snake, sun, sword, tart, throne, tomb, torch, tower, tulip; do v11: forno, fornocheio, peel, paforno, hand6, helmet, lupa; do v12: galoassado, galocanta, galolevanta (animado: levanta-se em ~1 s), travessa, vieira, balanca. Ator extra: `judge` (juiz de gola clara).
- Etiquetas (y≈0,29, até 3,45 s o gancho): em `closeup`, descer o ícone principal (`"y":0.3` a `0.5`) quando houver etiqueta nesse plano; `tiltUp`/`tiltDown` deslocam o assunto para trás da etiqueta (preferir drift/panR/push); etiqueta de uma só linha quando o assunto é grande.
- O corte de um plano tem de ficar ≥0,8 s das pontas da frase (na reviravolta, prender o corte à palavra anterior se a palavra do twist for a última).
- Variar: nunca duas entradas seguidas com o mesmo template+câmara; usar `closeup` com ícone nos momentos-chave; a última entrada é sempre um `closeup` com ícone `question` (ou o tema).
- Pré-visualizar antes de renderizar:
```
cd /home/claude/kit && ./build.sh stories/vNN.json /home/claude/kit/out/vNN.html
rm -f out/sNN_*.jpg && node still.js $PWD/out/vNN.html $PWD/out/sNN all
ffmpeg -y -loglevel error -pattern_type glob -i 'out/sNN_*.jpg' -filter_complex "scale=270:-1,tile=6x5:padding=4:color=white" -frames:v 1 out/sheetNN.jpg   # ver com Read (até 30 planos)
```
(os caminhos para `still.js` têm de ser absolutos). Corrigir ícones/planos estranhos (um ícone que não se reconheça muda-se por outro).

### 3.1.1 Abertura (aprovado pelo João a 26/11/2026, a partir do vídeo 13; verificação obrigatória)
- **0,0–3 s:** a "coisa" da história é o objeto central desde 0,0 s (a própria ação, objeto ou animal; nunca um símbolo indireto, como um relógio para uma dança). No máximo **3 blocos de texto**: título do gancho + legenda + **só um** de selo ou contador. Sem etiquetas nem `versus` antes dos 3,45 s.
- **3–7 s:** pelo menos **2 mudanças de imagem** (corte, `b`/`c` com `"at"` se for preciso), nunca uma figura parada. Uma etiqueta que **crie curiosidade** com factos da narração entre 3,45 e 7 s; a data pode ir junta, mas não sozinha (importante quando a 2.ª frase começa por uma data: v15, v17, v19, v21, v24, v25).
- Depois do `retime.py`, escrever o `config.json` e **antes do render** correr:
```
python3 tools/edit/check_abertura.py $W/align.json $W/config.json   # tem de dizer ABERTURA OK; se reprovar, corrigir a história ou o config e repetir
```
- Língua: **PT-BR mantém-se** (decisão do João, 26/11: quer chegar a Portugal e ao Brasil). Não propor nem testar PT-PT.

### 3.2 Render (cerca de 4–6 minutos)
```
cd /home/claude/kit && rm -f out/doneNN.txt && ./renderv.sh NN      # gera out/videoNN_silent.mp4
cp out/videoNN_silent.mp4 $W/v.mp4
```
Não imprimir os logs de render com `tail` (usam `\r`); verificar com `ls out/doneNN.txt`.

### 3.3 Configuração de edição `$W/config.json`
```
{"hook":["LINHA 1","LINHA 2 (âmbar)"],          // título do gancho, 2 linhas, MAIÚSCULAS, forte/polémico/criativo
 "stamp":["SELO L1","SELO L2"],                  // selo âmbar a partir de 1,45 s: facto verificável da narração
 "counter":{"to":461,"label":"SOLDADOS · 1859"}, // opcional: contador que sobe no gancho (só se houver um número forte na narração)
 "tags":[{"at":{"word":"1859","nth":0,"off":-0.05},"text":"LINHA A\nLINHA B","dur":2.4,"kind":"d|t|p"}],
 "keywords":["palavra","outra"],                 // palavras que recebem zoom de impacto
 "sfx":[{"at":31.7,"kind":"cannon","gain":0.6}],
 "music":"dark|mystic|warm|tense|quirky",
 "drums":[{"from":25.0,"to":33.0}],              // opcional: tambor que acelera
 "alert_words":["guerra","cólera"],              // opcional: palavras de perigo/choque, a vermelho nas legendas (2–5 por vídeo)
 "loops":[{"kind":"clocktick","from":6,"to":14,"every":0.5,"accel":0.98,"min":0.25,"gain":0.35}],  // opcional: MOTIVO SONORO próprio do vídeo, repetido num trecho
 "punch_gap":2.0,                                 // máx. segundos entre zooms de impacto. REGRA R2: pôr SEMPRE 2.0 nos vídeos novos (omissão do código é 3.0, só vale para vídeos antigos); 2.5 só se ficar cansativo
 "loop_end":true}                                 // omissão true: flash+tensão no último 0,35 s que desagua no frame 0 (loop)
```
- **R5 (teste de som):** cada etiqueta `kind:"p"` ganha um `sfx` `stab` ou `chime` (gain 0.5–0.7) no mesmo instante (segundo da palavra da etiqueta, impresso pelo `cap.py`) e cada `kind:"t"` ganha um `riser` ~1,2 s antes. Não mexer na música nem nos `loops` do motivo próprio.
- `tags` (3–7): etiquetas de dados/ano/virada ao longo do vídeo. `kind`: `d` dado, `t` teaser (cria tensão antes da revelação), `p` payoff (revelação). O CTA "SIGA PARA A PRÓXIMA HISTÓRIA IMPROVÁVEL" é acrescentado sozinho.
- `at.word`: a palavra como aparece nas legendas (números por extenso viram algarismos: "mil oitocentos e cinquenta e nove" → `1859`, "quatrocentos e sessenta e um" → `461`; pontuação final conta, ex. `morreu.`/`pequena?`). Se a palavra não existir, o script lista as disponíveis.
- **R7:** o título do gancho nomeia a coisa chocante em palavras simples (nunca abstrato/institucional) e o plano 1 mostra essa coisa desde 0,0 s; a maior parte do público decide aos 0:01 (métricas do v04).
- Gancho: tem de ser forte, polémico ou criativo nos primeiros 3 s (ver `learnings.md` para estilos e o que está a funcionar). **R3:** além de A–D há os estilos **E** (origem sombria de objeto comum) e **F** (pergunta prática "Como sobreviviam a…?"), só quando a narração sustenta o facto; entram no A/B a cada 3 vídeos.
- `sfx.kind` possíveis (novos: crow, bubbles, cough, clocktick, heartbeat, pizz, chime): womp, gavel, rumble, bell, bellhi, belllo, thunder, crack, boom, riser, pop, horn, cannon, explosion, splash, door, zap, rain, rustle, step, clack, thump, press, stab, gun, crackle.
- `music`: dark (tensão/guerra), mystic (lenda/mistério), warm (curiosidade leve), tense (pizzicato investigativo, suspense rápido), quirky (absurdo/cómico).
- **Marca do Galo**: o CTA final já inclui um cocorico sintetizado subtil. Não o remover.

### 3.5 Motivo próprio de cada vídeo (retenção — OBRIGATÓRIO)
Cada vídeo ganha 1 "assinatura" que o torna diferente do anterior, sempre dentro do visual sépia do kit:
1. **Um objeto/cena nova** na história visual (ex.: relógio e ampulheta para tempo, barra de "cheiro" para o fedor, ponto de interrogação para mistérios). Se o kit não tiver o objeto, desenha-o em SVG simples no mesmo traço (contorno castanho, enchimento sépia, 1 cor de acento âmbar).
2. **Um motivo sonoro** com `loops` (tique-taque, batimento, bolhas, pizzicato…) ou 2–3 `sfx` de momento ligados ao tema.
3. **Um mood de música** que combine com o tema (não repetir o mesmo 3 vezes seguidas).
4. **2–5 `alert_words`** a vermelho (o absurdo/perigo); as datas/números ficam a âmbar (já automático).
5. Ritmo de imagem: planos de ~3 s (2 ou mais por frase, ver 3.1); o `retime.py` imprime a média e o máximo e avisa acima de 5 s (corrigir com `c`/`d` ou outra palavra). Zooms, etiquetas, contadores e SFX continuam por cima.
6. Cadência R2: `punch_gap` 2.0 e um evento novo (zoom, etiqueta, SFX, câmara) a cada ~2 s.
7. Fecho em loop: a pergunta final + CTA terminam com o flash a subir que liga ao frame 0 (`loop_end`). **Regra de marca:** qualquer reforço de loop (o último plano a ecoar o primeiro, ícone ou texto temático) acontece ANTES da palavra "Siga"; o CTA e o cocorico ficam intactos (o cocorico toca ~0,55 s depois do início do CTA, em `sfx.py`) e o flash do `loop_end` (últimos 0,35 s) mantém-se.
Antes de montar, escreve uma linha em `learnings.md` (secção "Experiências"): o que vais testar neste vídeo (gancho, motivo, mood).

### 3.4 Montagem final
```
bash tools/edit/finish.sh NN $W      # legendas + SFX + música + mistura medida (mix.py) + marca de água + loudnorm; cria $W/final.mp4
```
**Som (aprovado a 25/11/2026), tratado pelo `mix.py`:** picos dos efeitos ≤ 0,7× o pico da voz; efeitos abaixo da voz enquanto ela fala (mais no gancho); música ~11 dB abaixo da voz (~8 dB nas pausas); música parada na reviravolta. Os valores ficam em `$W/levels.json`; se aparecer `MISTURA REPROVADA`, o script pára: corrigir (normalmente um `gain` exagerado em `sfx`/`loops`) e repetir; nunca contornar a verificação. Os `gain` do config continuam a valer, mas o `mix.py` limita os excessos.
Verificar (obrigatório): **primeiro extrair fotogramas em 0.0 s e 0.1 s e confirmar que o título do gancho se lê e o frame não está branco/vazio (R6)**; depois extrair fotogramas em 0.3 s, 1.4 s e 1.55 s (tem de haver mudança de plano), 1.9 s, 3.0 s, na reviravolta (`timing.json`, t+0,6 s), meio e fim (`ffmpeg -ss T -i final.mp4 -frames:v 1 x.png`) e **ver** com Read. Confirmar: gancho legível sem tapar a cara/ícone, legendas no sítio, marca de água no canto superior direito sem sobrepor o gancho, ortografia PT-BR correta, duração 44–61 s, pico verdadeiro ≤ -1 dBTP, ficheiro < 95 MB. Corrigir e voltar a executar `finish.sh` (é rápido, ~1 min) se algo falhar.

## 4. Publicar e agendar
1. Escolher o nome: `videos/galo_<slug>_vNN.mp4` (slug curto sem acentos). Copiar `$W/final.mp4`.
2. `git add`, commit, `git -c push.negotiate=true push origin main`. URL público: `https://raw.githubusercontent.com/proseven222/galo-videos/main/videos/<ficheiro>`.
3. Descrição PT-BR (partir de `scripts/ptbr_all.json`, item com `id` = N, campo `desc`; adaptar à narração final): linha de gancho com emoji, 1–2 linhas de contexto com factos da narração, pergunta + 👇, `Siga para a próxima história improvável! 🐔`, 9 hashtags (regra R4: #historia #curiosidades #paravoce #fyp #historiasimprovaveis #foryou #viral + 2 do tema), linha em branco e `⚠️ Vídeo feito com IA.`
4. Buffer `create_post`: `channelId` `6b059f178541f09ecb8a802e`, `schedulingType:"automatic"`, `mode:"customScheduled"`, `dueAt` = `state.next_publish_date` + `T18:00:00` com o desvio de Lisboa dessa data (UTC+00:00 no inverno, +01:00 no horário de verão; confirmar com `get_account.currentTime`), `assets:[{video:{url, metadata:{thumbnailOffset:2000}}}]` (R8: capa com o gancho), `metadata.tiktok:{title:"<título curto com emoji>", isAiGenerated:true}`. O `dueAt` tem de estar no futuro; o Buffer só aceita 10 posts agendados em simultâneo.
5. Confirmar `status:"scheduled"` na resposta. Se der "Video could not be read", esperar 1 min e tentar de novo (o raw do GitHub pode demorar a propagar); se falhar 3 vezes, registar o erro.
6. Limpeza: apagar de `videos/` os ficheiros cuja data de publicação já passou (git rm + push).
7. Atualizar `state.json`: `next_video += 1`, `next_publish_date += 1 dia`, adicionar a `published` `{video, date, post_id, hook_style, hook_text}`. Fazer commit e push de `state.json` e `learnings.md`.

## 4b. Atualizar o calendário (dashboard) — SEMPRE depois de agendar
O painel do utilizador é um artifact (slug em `state.json` → `dashboard.artifact_slug`; ficheiros `index.html` + `data.js`). Só o `data.js` muda.
1. Miniatura: `ffmpeg -y -loglevel error -ss 1.9 -i $W/final.mp4 -frames:v 1 -vf scale=216:-2 -q:v 6 dashboard/thumbs/vNN.jpg`
2. Acrescentar a `dashboard/posts.json` (lista `posts`) um item: `{"id":"vNN","video":N,"date":"AAAA-MM-DD","time":"18:00","status":"scheduled","title":"<tema curto (local, ano)>","tiktokTitle":"<título do post>","hookStyle":"<estilo>","hookText":"<texto do gancho em maiúsculas>","videoUrl":"<URL raw do GitHub>","bufferPostId":"<id>","duration":<s>,"description":"<descrição completa enviada ao TikTok, com quebras de linha \n>"}`.
3. Marcar como publicados os vídeos cuja data já passou: `"status":"published"` (o painel também o faz sozinho pela hora, mas assim fica registado). Se um agendamento falhou, `"status":"error"`.
4. `python3 tools/dashboard_build.py` → gera `/home/claude/dash/data.js` (miniaturas embutidas em base64).
5. `mcp__claude-artifacts__get_artifact` com o slug → `version`; depois `mcp__claude-artifacts__publish_files` com `slug`, `base_version`=version, `mode:"patch"`, `files:[{as:"data.js", path:"/home/claude/dash/data.js"}]`. NÃO republicar o `index.html` (só se o painel tiver sido apagado: nesse caso usar `dashboard/index.html` do repositório e criar um novo artifact, e guardar o novo slug em `state.json`).
6. `git add dashboard state.json`, commit e push (junto com o passo 4.7).
Se o painel falhar, não bloqueia o vídeo: registar em `state.errors` e avisar no resumo.

## 5. Fim da série
`scripts/narr_final.json` só vai até ao vídeo 30. Se `next_video` > 30: não produzir nada; escrever em `state.json` `"status":"sem guiões"` e avisar o utilizador no resumo final para combinar novos guiões/narrações.

## 6. Resumo final (em PT-PT, curto)
Dizer: vídeo produzido (número e tema), gancho usado e estilo, data/hora agendada, link do post no Buffer, principais conclusões das métricas (se houver) e o que será testado a seguir. Lembrar que o TikTok exige etiqueta de IA (já está ativada no agendamento).

## Anexo — exemplo no formato atual (vídeo 11, teste de 25/11)
`tools/examples/v11/story_draft_2planos.json`: 17 planos, média 2,7 s, medalhões presos à palavra e reviravolta em "acabou". O config é o de `tools/examples/v11/config.json`.

## Anexo — exemplo de configuração (vídeo 10, história ainda com um plano por frase)
`tools/examples/v10/story_draft.json` e `tools/examples/v10/config.json` são o par história+configuração do vídeo 10, usado como modelo. Notas aprendidas: o plano `landscape` com um único `banners` central parece uma bandeira estranha (preferir 2 banners laterais ou nenhum); o contador só funciona bem com número ≥ 100; o loudnorm + limitador deixa a sonoridade em torno de -15 LUFS, que é aceitável.

## Nota — datas
A 24/11 o utilizador confirmou que a partir de 27/11 às 18:00 não tem mais nada agendado: a tarefa diária começa aí (vídeo 11 → 27/11, vídeo 12 → 28/11, e assim por diante, um por dia). Os ficheiros `videos/galo_*_v02..v07.mp4` são vídeos prontos do utilizador, não os voltes a agendar.
