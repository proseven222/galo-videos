#!/bin/bash
# uso: build.sh story.json out.html
cd /home/claude/kit
{ cat <<'H'
<!DOCTYPE html><html><head><meta charset="utf-8"><link rel="stylesheet" href="x"><style>html,body{margin:0;background:#000}canvas{display:block}</style></head>
<body><svg width="0" height="0" style="position:absolute"><filter id="ink" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/><feColorMatrix in="d" type="saturate" values="0" result="gr"/><feComponentTransfer in="gr"><feFuncR type="gamma" amplitude="1.1" exponent="0.42" offset="0"/><feFuncG type="gamma" amplitude="1.1" exponent="0.42" offset="0"/><feFuncB type="gamma" amplitude="1.1" exponent="0.42" offset="0"/></feComponentTransfer></filter></svg>
<canvas id="c" width="1080" height="1920"></canvas><script>
H
echo -n "window.STORY="; cat "$1"; echo ";"
cat core.js brand.js figs.js icons.js scenes1.js scenes2.js final.js
echo '</script></body></html>'; } | sed 's#<link rel="stylesheet" href="x">##' > "$2"
