#!/bin/bash
# prepara o ambiente de uma sessao nova: copia o kit para /home/claude/kit (caminhos fixos nos scripts)
set -e
R="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p /home/claude/kit/out /home/claude/kit/stories /home/claude/work
cp -r "$R"/tools/kit/* /home/claude/kit/
chmod +x /home/claude/kit/*.sh "$R"/tools/edit/*.sh
python3 -c "import numpy,scipy" && echo "python ok"
node -e "require('playwright')" 2>/dev/null && echo "playwright(node) ok" || echo "ATENCAO: modulo node playwright nao encontrado (ver NODE_PATH)"
ffmpeg -version | head -1; fc-list | grep -qi anton && echo "fonte Anton ok"
