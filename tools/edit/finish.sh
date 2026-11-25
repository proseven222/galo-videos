#!/bin/bash
# uso: finish.sh NN WORKDIR   (WORKDIR tem: v.mp4 (render mudo), nar.mp3, align.json, timing.json, config.json)
set -e
N=$1; W=$2; E="$(cd "$(dirname "$0")" && pwd)"; cd "$W"
python3 "$E/cap.py" align.json config.json . | tail -3
python3 "$E/sfx.py"
python3 "$E/mix.py"      # niveis face a voz; falha (e para aqui) se sairem do intervalo
DUR=$(python3 -c "import json;print(json.load(open('punch.json'))['dur'])")
cp "$E/galo_logo.webp" .
ffmpeg -y -hide_banner -loglevel error -i v.mp4 -i mix.wav -i galo_logo.webp -filter_complex_script fc.txt -map "[vo]" -map "[a]" -c:v libx264 -preset medium -crf 21 -maxrate 9M -bufsize 18M -r 30 -c:a aac -b:a 192k -t $DUR -movflags +faststart final_raw.mp4
TP=$(ffmpeg -hide_banner -i final_raw.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A1 "True peak" | grep Peak | tail -1 | awk '{print $2}')
echo "true peak: $TP dBTP"
if awk "BEGIN{exit !(${TP:--99} > -1.0)}"; then
  # o limitador mede picos de amostra; o pico verdadeiro (apos AAC) pode ficar acima de -1 dBTP: baixar ate cumprir
  for LIM in 0.84 0.79 0.74 0.69; do
    ffmpeg -y -hide_banner -loglevel error -i final_raw.mp4 -c:v copy -af "alimiter=limit=$LIM:level=false" -c:a aac -b:a 192k -movflags +faststart final.mp4
    TP2=$(ffmpeg -hide_banner -i final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A1 "True peak" | grep Peak | tail -1 | awk '{print $2}')
    echo "limite $LIM -> true peak: $TP2 dBTP"
    awk "BEGIN{exit !(${TP2:--99} <= -1.0)}" && break
  done
else cp final_raw.mp4 final.mp4; fi
ls -la final.mp4; ffprobe -v error -show_entries format=duration -of csv=p=0 final.mp4
