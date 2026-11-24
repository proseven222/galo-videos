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
3. Ler `state.json` e `learnings.md`.

## 2. Ler resultados e aprender (se houver posts publicados)
- Buffer: `get_account` (organização), `list_posts` com `status:["sent"]`, `includeMetrics:true`, canal `6b059f178541f09ecb8a802e` (TikTok `ogalosabetudo`). Se as métricas não vierem (falta de permissão), registar isso e seguir.
- Atualizar a tabela em `learnings.md` (vídeo, estilo de gancho, visualizações, gostos, comentários, partilhas, retenção se existir) e escrever 2–3 linhas de conclusão: que estilo de gancho/overlay funcionou melhor.
- Escolher o estilo de gancho do vídeo de hoje: usar o que está a ganhar, mas **a cada 3 vídeos testar um estilo diferente** (A/B). Estilos em `learnings.md`.
- Uma vez por semana (segunda-feira): fazer 2–3 `WebSearch` sobre ganchos que estão a funcionar em TikTok de história/curiosidades (PT-BR) e anotar o que adaptar.

## 3. Produzir o vídeo N (N = `state.next_video`)
Pasta de trabalho: `W=/home/claude/work/vNN` (NN com 2 dígitos).
```
mkdir -p $W && cp audio/vNN.mp3 $W/nar.mp3
python3 tools/edit/align.py N audio/vNN.mp3 scripts/narr_final.json $W/align.json   # sincroniza o texto com a voz (sem ASR)
```
Ver o resultado: 8 linhas L1..L8; cada pausa deve cair onde há pontuação. Se o custo for muito alto (>40) ou faltarem linhas, rever.

### 3.1 História visual (8 planos = 8 linhas da narração)
Escrever `$W/story_draft.json` com `{"seed":N*10+1,"shots":[...]}`; cada plano corresponde à linha de narração com o mesmo número (plano 1 = frase-gancho, plano 8 = pergunta + CTA). Os tempos (`sec`) são calculados por `retime.py`, por isso põe `"sec":1`.
```
python3 tools/edit/retime.py $W/align.json $W/story_draft.json /home/claude/kit/stories/vNN.json
```
Ver exemplos reais em `tools/kit/stories/v05n..v09n.json` (e `/home/claude/kit/stories/v10.json` se existir). Vocabulário:
- Plano 1 leva `"slam":"<ícone>"` (carimbo gigante do ícone no gancho).
- `tpl`: `landscape` (céu/terreno, `actors`, `props`, `banners`, `birds`, `fire`, `rain`, `snow`, `smoke`...), `interior` (`kind`:hall/archive..., `table`, `items`, `actors`, `fore`), `closeup` (`icons`:[{n,x,y,s}], `below` atores), `map` (`land`:[{n:"island",x,y,w,h}], `pins`, `routes`, `waves`, `dots`), `sea`, `tunnel`.
- `cam`: push, pull, panL, panR, tiltUp, tiltDown, orbit, drift. Alternar câmaras e templates entre planos seguidos.
- `tod`: day, dusk, night, gold, grey, storm, dawn, fire. `sky`: castle, city, dunes, forest, huts, jungle, monastery, mountains, port, ruins, tower, village, volcano, plain. `gnd`: sand, mud, stone...
- Atores `type`: woman, man, top, scholar, soldier, knight, king, monk, priest, wizard, pilgrim, sailor, hood. `mode`: idle, march, run, cheer, up, dance, cough, fan, kneel, point, look, shade, wave. Props de ator: spear, scroll, banner...
- Ícones (`slam`, `icons[].n`, `props` `{t:"icon",n:...}`): anchor, bell, book, bread, candle, cannon, castle, clock, coins, crown, gallows, globe, hourglass, key, lantern, moon, mule, pig, plane, question, quill, ring, rooster, scroll, ship, shoe, shovel, snake, sun, sword, tart, throne, tomb, torch, tower, tulip.
- Variar: nunca dois planos seguidos com o mesmo template+câmara; usar `closeup` com ícone nos momentos-chave; o último plano é sempre um `closeup` com ícone `question` (ou o tema).
- Pré-visualizar antes de renderizar:
```
cd /home/claude/kit && ./build.sh stories/vNN.json /home/claude/kit/out/vNN.html
node still.js $PWD/out/vNN.html $PWD/out/sNN 0:0.7 1:0.6 2:0.6 3:0.6 4:0.6 5:0.6 6:0.6 7:0.6
ffmpeg -y -loglevel error -pattern_type glob -i 'out/sNN_*.jpg' -filter_complex "scale=270:-1,tile=8x1" -frames:v 1 out/sheetNN.jpg   # ver com Read
```
(os caminhos para `still.js` têm de ser absolutos). Corrigir ícones/planos estranhos (um ícone que não se reconheça muda-se por outro).

### 3.2 Render (cerca de 5–6 minutos)
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
 "music":"dark|mystic|warm",
 "drums":[{"from":25.0,"to":33.0}]}              // opcional: tambor que acelera
```
- `tags` (3–7): etiquetas de dados/ano/virada ao longo do vídeo. `kind`: `d` dado, `t` teaser (cria tensão antes da revelação), `p` payoff (revelação). O CTA "SIGA PARA A PRÓXIMA HISTÓRIA IMPROVÁVEL" é acrescentado sozinho.
- `at.word`: a palavra como aparece nas legendas (números por extenso viram algarismos: "mil oitocentos e cinquenta e nove" → `1859`, "quatrocentos e sessenta e um" → `461`; pontuação final conta, ex. `morreu.`/`pequena?`). Se a palavra não existir, o script lista as disponíveis.
- Gancho: tem de ser forte, polémico ou criativo nos primeiros 3 s (ver `learnings.md` para estilos e o que está a funcionar).
- `sfx.kind` possíveis: womp, gavel, rumble, bell, bellhi, belllo, thunder, crack, boom, riser, pop, horn, cannon, explosion, splash, door, zap, rain, rustle, step, clack, thump, press, stab, gun, crackle.
- `music`: dark (tensão/guerra), mystic (lenda/mistério), warm (curiosidade leve).

### 3.4 Montagem final
```
bash tools/edit/finish.sh NN $W      # legendas + SFX + música + marca de água + loudnorm; cria $W/final.mp4
```
Verificar (obrigatório): extrair fotogramas em 0.3 s, 1.9 s, 3.0 s, meio e fim (`ffmpeg -ss T -i final.mp4 -frames:v 1 x.png`) e **ver** com Read. Confirmar: gancho legível sem tapar a cara/ícone, legendas no sítio, marca de água no canto superior direito sem sobrepor o gancho, ortografia PT-BR correta, duração 44–61 s, pico verdadeiro ≤ -1 dBTP, ficheiro < 95 MB. Corrigir e voltar a executar `finish.sh` (é rápido, ~1 min) se algo falhar.

## 4. Publicar e agendar
1. Escolher o nome: `videos/galo_<slug>_vNN.mp4` (slug curto sem acentos). Copiar `$W/final.mp4`.
2. `git add`, commit, `git -c push.negotiate=true push origin main`. URL público: `https://raw.githubusercontent.com/proseven222/galo-videos/main/videos/<ficheiro>`.
3. Descrição PT-BR (partir de `scripts/ptbr_all.json`, item com `id` = N, campo `desc`; adaptar à narração final): linha de gancho com emoji, 1–2 linhas de contexto com factos da narração, pergunta + 👇, `Siga para a próxima história improvável! 🐔`, 7 hashtags (incluir #historia #curiosidades #paravoce #fyp #historiasimprovaveis + 2 do tema), linha em branco e `⚠️ Vídeo feito com IA.`
4. Buffer `create_post`: `channelId` `6b059f178541f09ecb8a802e`, `schedulingType:"automatic"`, `mode:"customScheduled"`, `dueAt` = `state.next_publish_date` + `T18:00:00` com o desvio de Lisboa dessa data (UTC+00:00 no inverno, +01:00 no horário de verão; confirmar com `get_account.currentTime`), `assets:[{video:{url}}]`, `metadata.tiktok:{title:"<título curto com emoji>", isAiGenerated:true}`. O `dueAt` tem de estar no futuro; o Buffer só aceita 10 posts agendados em simultâneo.
5. Confirmar `status:"scheduled"` na resposta. Se der "Video could not be read", esperar 1 min e tentar de novo (o raw do GitHub pode demorar a propagar); se falhar 3 vezes, registar o erro.
6. Limpeza: apagar de `videos/` os ficheiros cuja data de publicação já passou (git rm + push).
7. Atualizar `state.json`: `next_video += 1`, `next_publish_date += 1 dia`, adicionar a `published` `{video, date, post_id, hook_style, hook_text}`. Fazer commit e push de `state.json` e `learnings.md`.

## 5. Fim da série
`scripts/narr_final.json` só vai até ao vídeo 30. Se `next_video` > 30: não produzir nada; escrever em `state.json` `"status":"sem guiões"` e avisar o utilizador no resumo final para combinar novos guiões/narrações.

## 6. Resumo final (em PT-PT, curto)
Dizer: vídeo produzido (número e tema), gancho usado e estilo, data/hora agendada, link do post no Buffer, principais conclusões das métricas (se houver) e o que será testado a seguir. Lembrar que o TikTok exige etiqueta de IA (já está ativada no agendamento).

## Anexo — exemplo completo (vídeo 10)
`tools/examples/v10/story_draft.json` e `tools/examples/v10/config.json` são o par história+configuração do vídeo 10, usado como modelo. Notas aprendidas: o plano `landscape` com um único `banners` central parece uma bandeira estranha (preferir 2 banners laterais ou nenhum); o contador só funciona bem com número ≥ 100; o loudnorm + limitador deixa a sonoridade em torno de -15 LUFS, que é aceitável.
