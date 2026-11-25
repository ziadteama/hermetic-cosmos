#!/usr/bin/env bash
# Ouro, live: stays on screen and reacts to your music.  Usage: ouro live   (q or Ctrl-C to leave)
# While any MPRIS player (Spotify, a browser, VLC…) plays, he DJs; pause it and he chills.
# Kept light: the art is coloured once at start, a frame is one printf, players are asked every 1.5s.
C="$HOME/.config/cosmos"; M="$C/mascot"
rgb() { printf '\033[38;2;%d;%d;%dm' "0x${1:1:2}" "0x${1:3:2}" "0x${1:5:2}"; }
declare -A T=( [s]="$(rgb '#c0c8d8')" [m]="$(rgb '#7fa36b')" [r]="$(rgb '#c77d9b')" [g]="$(rgb '#d4af37')"
  [t]="$(rgb '#4fb3a9')" [e]="$(rgb '#e07a5f')" [w]="$(rgb '#9a7b55')" [o]="$(rgb '#6e5a40')"
  [R]="$(rgb '#2f7d75')" [v]="$(rgb '#8a6bd1')" [d]="$(rgb '#a9a3b8')" [0]=$'\033[0m' )
paint() { local l="$1" k; for k in "${!T[@]}"; do l="${l//\{$k\}/${T[$k]}}"; done; REPLY="$l"; }
width() { local l="$1"; while [[ $l =~ ^(.*)\{[a-zA-Z0-9]\}(.*)$ ]]; do l="${BASH_REMATCH[1]}${BASH_REMATCH[2]}"; done; REPLY=${#l}; }

# each art file -> its lines coloured and padded to the info column, done once
prep() {
  local -n out=$1; local raw l pad; out=()
  mapfile -t raw < "$2"
  for l in "${raw[@]}"; do
    width "$l"; pad=$(( 34 - REPLY )); (( pad < 2 )) && pad=2
    paint "$l"; out+=("$REPLY$(printf '%*s' "$pad" '')")
  done
}
prep F0 "$M/ouro-dj.txt"; prep F1 "$M/ouro-dj-1.txt"; prep F2 "$M/ouro-dj-2.txt"; prep F3 "$M/ouro-dj-3.txt"
prep IDLE "$M/ouro-greet.txt"
BLANK=$(printf '%34s' '')

age=$(( ( $(date +%s) - 947182440 ) % 2551443 * 30 / 2551443 ))
names=("new moon" "waxing crescent" "first quarter" "waxing gibbous" "full moon" "waning gibbous" "last quarter" "waning crescent")
phase=${names[$(( (age * 8 + 15) / 30 % 8 ))]}

# what's playing: sets playing, title, artist, player (Spotify asked first)
poll() {
  playing=0; title=""; artist=""; player=""
  command -v busctl >/dev/null || return
  local n s meta first=() rest=()
  for n in $(busctl --user --acquired --no-legend --timeout=1 list 2>/dev/null | awk '$1 ~ /^org\.mpris\.MediaPlayer2\./ {print $1}'); do
    [[ $n == *spotify* ]] && first+=("$n") || rest+=("$n")
  done
  for n in "${first[@]}" "${rest[@]}"; do
    s=$(busctl --user --timeout=1 get-property "$n" /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player PlaybackStatus 2>/dev/null)
    [[ $s == 's "Playing"' ]] || continue
    meta=$(busctl --user --timeout=1 get-property "$n" /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player Metadata 2>/dev/null)
    [[ $meta =~ \"xesam:title\"\ s\ \"([^\"]*)\" ]] && title="${BASH_REMATCH[1]}"
    [[ $meta =~ \"xesam:artist\"\ as\ [0-9]+\ \"([^\"]*)\" ]] && artist="${BASH_REMATCH[1]}"
    player="${n#org.mpris.MediaPlayer2.}"; player="${player%%.*}"; playing=1
    [[ -n $title ]] || title="something good"
    return
  done
}

# the info column, rebuilt only after a poll
side() {
  local raw l
  if (( playing )); then
    raw=("" "{g}✡  AS ABOVE, SO BELOW  ✡{0}" "" "{g}ouro's on the decks{0}" ""
         "{v}♪{0} {t}${title}{0}" "{d}  ${artist:+$artist · }${player}{0}" "" "{s}☽ $phase{0}" "" "{d}q to leave{0}")
  else
    raw=("" "{g}✡  AS ABOVE, SO BELOW  ✡{0}" "" "{m}ouro is chilling{0}" "" "{d}nothing playing. put a song on, bro{0}"
         "" "" "{s}☽ $phase{0}" "" "{d}q to leave{0}")
  fi
  I=(); for l in "${raw[@]}"; do paint "$l"; I+=("$REPLY"); done
}

cleanup() { printf '\033[?25h\033[0m'; stty echo 2>/dev/null; tput rmcup 2>/dev/null; exit 0; }
trap cleanup INT TERM EXIT
trap 'printf "\033[2J"' WINCH
tput smcup 2>/dev/null; printf '\033[?25l\033[2J'; stty -echo 2>/dev/null

beat=0
while :; do
  (( beat % 3 == 0 )) && { poll; side; }
  if (( playing )); then
    case $(( beat % 4 )) in 0) A=("${F0[@]}");; 1) A=("${F1[@]}");; 2) A=("${F2[@]}");; *) A=("${F3[@]}");; esac
  else
    A=("${IDLE[@]}")
  fi
  frame=$'\033[H'
  n=$(( ${#A[@]} > ${#I[@]} ? ${#A[@]} : ${#I[@]} ))
  for ((i=0; i<n; i++)); do frame+="${A[i]:-$BLANK}${I[i]:-}"$'\033[0m\033[K\n'; done
  printf '%s\033[J' "$frame"
  # one beat is 0.45s; q leaves
  if read -rsn1 -t 0.45 key; then [[ $key == [qQ] ]] && break; fi
  beat=$(( (beat + 1) % 12 ))
done
