#!/usr/bin/env bash
# Hermetic Cosmos installer for Ubuntu/GNOME + bash. Safe to re-run.
#   ./install.sh            terminal theme, prompt, Ouro greeting, wallpaper
#   ./install.sh --no-desktop   skip wallpaper / dark mode
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; C="$HOME/.config/cosmos"; TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$C/backup" "$C/mascot" "$HOME/.local/bin" "$HOME/.local/share/fonts"
say() { printf '\033[38;2;212;175;55m△\033[0m %s\n' "$*"; }

say "Backing up current settings to $C/backup"
[[ -f "$C/backup/bashrc.bak" ]] || cp "$HOME/.bashrc" "$C/backup/bashrc.bak"
[[ -f "$C/backup/terminal.dconf" ]] || dconf dump /org/gnome/terminal/ > "$C/backup/terminal.dconf" || true
[[ -f "$C/backup/desktop.txt" ]] || { gsettings get org.gnome.desktop.background picture-uri
  gsettings get org.gnome.desktop.background picture-uri-dark
  gsettings get org.gnome.desktop.interface color-scheme; } > "$C/backup/desktop.txt" 2>/dev/null || true

say "Copying Ouro, quotes and the greeting"
cp "$HERE/terminal/greet.sh" "$HERE/terminal/live.sh" "$HERE/terminal/quotes.txt" "$C/"
cp "$HERE"/terminal/mascot/* "$C/mascot/"
chmod +x "$C/greet.sh" "$C/live.sh"; ln -sf "$C/greet.sh" "$HOME/.local/bin/ouro"

if ! fc-list | grep -q "JetBrainsMono Nerd Font"; then
  say "Installing JetBrainsMono Nerd Font"
  curl -fsSL -o "$TMP/f.zip" https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/JetBrainsMono.zip
  unzip -oq "$TMP/f.zip" -d "$TMP/f"; mkdir -p "$HOME/.local/share/fonts/JetBrainsMonoNF"
  cp "$TMP"/f/JetBrainsMonoNerdFont-*.ttf "$HOME/.local/share/fonts/JetBrainsMonoNF/"; fc-cache -f >/dev/null
fi

if ! command -v starship >/dev/null; then
  say "Installing Starship prompt"
  curl -fsSL -o "$TMP/s.tgz" https://github.com/starship/starship/releases/download/v1.20.1/starship-x86_64-unknown-linux-musl.tar.gz
  tar -xzf "$TMP/s.tgz" -C "$TMP"; install -m755 "$TMP/starship" "$HOME/.local/bin/starship"
fi
[[ -f "$HOME/.config/starship.toml" ]] && cp "$HOME/.config/starship.toml" "$C/backup/starship.toml.bak"
cp "$HERE/terminal/starship.toml" "$HOME/.config/starship.toml"

if command -v dconf >/dev/null && ! dconf dump /org/gnome/terminal/legacy/profiles:/ | grep -q "visible-name='Cosmos'"; then
  say "Creating the Cosmos gnome-terminal profile"
  NEW=$(uuidgen); P=/org/gnome/terminal/legacy/profiles:/:$NEW/
  dconf write ${P}visible-name "'Cosmos'"; dconf write ${P}use-theme-colors false
  dconf write ${P}background-color "'#0b0a1a'"; dconf write ${P}foreground-color "'#ece6d6'"
  dconf write ${P}bold-color-same-as-fg true; dconf write ${P}cursor-colors-set true
  dconf write ${P}cursor-background-color "'#d4af37'"; dconf write ${P}cursor-foreground-color "'#0b0a1a'"
  dconf write ${P}highlight-colors-set true; dconf write ${P}highlight-background-color "'#3a3566'"
  dconf write ${P}highlight-foreground-color "'#ece6d6'"
  dconf write ${P}palette "['#1d1a3a','#e07a5f','#4fb3a9','#d4af37','#8a6bd1','#c77d9b','#7fb7d6','#c0c8d8','#3a3566','#f09a82','#7fd1c8','#e8c95e','#a98ee6','#e0a0bc','#a6d4ec','#ece6d6']"
  dconf write ${P}use-system-font false; dconf write ${P}font "'JetBrainsMono Nerd Font 12'"
  dconf write ${P}use-transparent-background true; dconf write ${P}background-transparency-percent 6
  dconf write ${P}cursor-shape "'ibeam'"; dconf write ${P}audible-bell false
  LIST=$(gsettings get org.gnome.Terminal.ProfilesList list | tr -d "[]' " )
  dconf write /org/gnome/terminal/legacy/profiles:/list "[$(echo "$LIST,$NEW" | sed "s/^,//; s/\([^,]*\)/'\1'/g; s/,/, /g")]"
  dconf write /org/gnome/terminal/legacy/profiles:/default "'$NEW'"
fi

if ! grep -q '# >>> cosmos >>>' "$HOME/.bashrc"; then
  say "Adding the greeting and prompt to ~/.bashrc"
  cat >> "$HOME/.bashrc" <<'RC'

# >>> cosmos >>>  (Hermetic Cosmos theme; remove this block to undo)
case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) export PATH="$HOME/.local/bin:$PATH" ;; esac
if [[ $- == *i* ]]; then
  [[ -x "$HOME/.config/cosmos/greet.sh" && -z "$COSMOS_QUIET" ]] && "$HOME/.config/cosmos/greet.sh"
  command -v starship >/dev/null && eval "$(starship init bash)"
fi
# <<< cosmos <<<
RC
fi

if [[ "${1:-}" != "--no-desktop" ]] && command -v gsettings >/dev/null; then
  say "Drawing the wallpaper"
  python3 -I "$HERE/terminal/wallpaper.py" 3840 2400 "$C/wallpaper-4k.png" >/dev/null
  gsettings set org.gnome.desktop.background picture-uri "file://$C/wallpaper-4k.png"
  gsettings set org.gnome.desktop.background picture-uri-dark "file://$C/wallpaper-4k.png"
  gsettings set org.gnome.desktop.background picture-options zoom
  gsettings set org.gnome.desktop.interface color-scheme prefer-dark
fi

say "Done. Open a new terminal to meet Ouro."
say "For Claude Code: claude plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos"
