#!/usr/bin/env bash
# Hermetic Cosmos greeting: Ouro + a line from above.  Usage: greet.sh [greet|think|error]
C="$HOME/.config/cosmos"; M="$C/mascot"; mood="${1:-greet}"
rgb() { printf '\033[38;2;%d;%d;%dm' "0x${1:1:2}" "0x${1:3:2}" "0x${1:5:2}"; }
declare -A T=( [s]="$(rgb '#c0c8d8')" [m]="$(rgb '#7fa36b')" [r]="$(rgb '#c77d9b')" [g]="$(rgb '#d4af37')"
  [t]="$(rgb '#4fb3a9')" [e]="$(rgb '#e07a5f')" [w]="$(rgb '#9a7b55')" [o]="$(rgb '#6e5a40')"
  [R]="$(rgb '#2f7d75')" [v]="$(rgb '#8a6bd1')" [d]="$(rgb '#a9a3b8')" [0]=$'\033[0m' )
paint() { local l="$1" k; for k in "${!T[@]}"; do l="${l//\{$k\}/${T[$k]}}"; done; printf '%s' "$l"; }
plain() { sed -E 's/\{[a-zA-Z0-9]\}//g' <<<"$1"; }

# custom image mascot takes over completely
if [[ -f "$M/custom.png" ]] && command -v chafa >/dev/null; then chafa --size=40x20 "$M/custom.png"; fi

art="$M/ouro-$mood.txt"; [[ -f "$M/custom.txt" ]] && art="$M/custom.txt"
[[ -f "$M/custom.png" ]] && command -v chafa >/dev/null && art=/dev/null
mapfile -t A < "$art"

# moon phase (synodic month from a known new moon)
age=$(( ( $(date +%s) - 947182440 ) % 2551443 * 30 / 2551443 ))
names=("new moon" "waxing crescent" "first quarter" "waxing gibbous" "full moon" "waning gibbous" "last quarter" "waning crescent")
phase=${names[$(( (age * 8 + 15) / 30 % 8 ))]}

mapfile -t Q < <(grep -v '^\s*$' "$C/quotes.txt"); pick="${Q[RANDOM % ${#Q[@]}]}"
text="${pick%|*}"; who="${pick##*|}"
I=("" "{g}✡  AS ABOVE, SO BELOW  ✡{0}" "" "{d}$(date '+%a %d %b %Y')  ·  {s}☽ $phase{0}" "")
if [[ "$who" == ouro ]]; then f=1; while IFS= read -r l; do
    if ((f)); then I+=("{t}ouro:{0} {d}$l{0}"); f=0; else I+=("      {d}$l{0}"); fi
  done < <(fold -s -w 46 <<<"$text")
else while IFS= read -r l; do I+=("{r}$l{0}"); done < <(fold -s -w 52 <<<"“$text”"); I+=("{d}            — $who{0}"); fi

n=$(( ${#A[@]} > ${#I[@]} ? ${#A[@]} : ${#I[@]} ))
for ((i=0; i<n; i++)); do
  a="${A[i]:-}"; p=$(plain "$a"); pad=$(( 34 - ${#p} )); (( pad < 2 )) && pad=2
  paint "$a"; printf '%*s' "$pad" ''; paint "${I[i]:-}"; printf '\n'
done
