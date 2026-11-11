#!/usr/bin/env bash
# Normalise the rendered video's audio to -14 LUFS (YouTube) without re-encoding the picture.
# Usage: scripts/master_audio.sh out/alyaska.mp4
set -euo pipefail
in="$1"; tmp="${in%.mp4}.tmp.mp4"
ffmpeg -y -v error -i "$in" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -ar 48000 "$tmp"
mv "$tmp" "$in"
echo "mastered $in"
