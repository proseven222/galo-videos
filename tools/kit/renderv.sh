#!/bin/bash
# uso: renderv.sh NN   (usa stories/vNN.json, gera out/videoNN_silent.mp4)
cd /home/claude/kit; mkdir -p out; N=$1
./build.sh stories/v$N.json /home/claude/kit/out/v$N.html
TOT=$(python3 -c "import json;print(sum(round(s['sec']*30) for s in json.load(open('stories/v$N.json'))['shots']))")
H=$((TOT/2))
node render.js /home/claude/kit/out/v$N.html 0 $H out/p${N}a.mp4 > out/log${N}a.txt 2>&1 &
node render.js /home/claude/kit/out/v$N.html $H $TOT out/p${N}b.mp4 > out/log${N}b.txt 2>&1 &
wait
printf "file 'p${N}a.mp4'\nfile 'p${N}b.mp4'\n" > out/list$N.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/list$N.txt -c copy out/video${N}_silent.mp4 && echo FIN > out/done$N.txt
