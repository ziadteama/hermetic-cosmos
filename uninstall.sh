#!/usr/bin/env bash
# Hermetic Cosmos uninstaller: puts things back the way install.sh found them.
set -uo pipefail
C="$HOME/.config/cosmos"; B="$C/backup"
say() { printf '\033[38;2;79;179;169m▽\033[0m %s\n' "$*"; }

if grep -q '# >>> cosmos >>>' "$HOME/.bashrc"; then
  say "Removing the cosmos block from ~/.bashrc"
  cp "$HOME/.bashrc" "$B/bashrc.before-uninstall"
  sed -i '/^# >>> cosmos >>>/,/^# <<< cosmos <<</d' "$HOME/.bashrc"
fi

if command -v dconf >/dev/null; then
  BASE=/org/gnome/terminal/legacy/profiles:
  COSMOS=$(dconf dump $BASE/ | awk -F'[]:[]' '/^\[:/{id=$3} /visible-name=.Cosmos./{print id}' | head -1)
  if [[ -n "$COSMOS" ]]; then
    say "Removing the Cosmos terminal profile"
    REST=$(gsettings get org.gnome.Terminal.ProfilesList list | tr -d "[]' " | tr ',' '\n' | grep -v "^$COSMOS$" | grep -v '^$')
    NEWLIST="[$(echo "$REST" | sed "s/.*/'&'/" | paste -sd, - | sed 's/,/, /g')]"
    dconf write $BASE/list "$NEWLIST"
    FIRST=$(echo "$REST" | head -1)
    [[ -n "$FIRST" ]] && dconf write $BASE/default "'$FIRST'"
    dconf reset -f "$BASE/:$COSMOS/"
  fi
fi

if [[ -f "$B/desktop.txt" ]] && command -v gsettings >/dev/null; then
  say "Restoring wallpaper and colour scheme"
  mapfile -t D < "$B/desktop.txt"
  [[ -n "${D[0]:-}" ]] && gsettings set org.gnome.desktop.background picture-uri "${D[0]//\'/}"
  [[ -n "${D[1]:-}" ]] && gsettings set org.gnome.desktop.background picture-uri-dark "${D[1]//\'/}"
  [[ -n "${D[2]:-}" ]] && gsettings set org.gnome.desktop.interface color-scheme "${D[2]//\'/}"
fi

if [[ -f "$B/starship.toml.bak" ]]; then cp "$B/starship.toml.bak" "$HOME/.config/starship.toml"
else rm -f "$HOME/.config/starship.toml"; fi
rm -f "$HOME/.local/bin/ouro"

say "Done. Open a new terminal."
say "Left in place (remove by hand if you like):"
say "  rm -rf ~/.config/cosmos ~/.local/share/fonts/JetBrainsMonoNF ~/.local/bin/starship && fc-cache -f"
say "  claude plugin uninstall hermetic-cosmos"
