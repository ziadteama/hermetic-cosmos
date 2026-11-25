# AGENTS.md: setting up and editing Hermetic Cosmos

This file is for AI coding agents (Claude Code, Codex, Antigravity, Cursor, and others) asked to install, adapt or change this theme on someone's machine. Humans should start with [README.md](README.md).

## Ground rules

1. **Ask before changing anything outside the repo.** The installer edits `~/.bashrc`, GNOME settings, fonts and the wallpaper. Tell the person what will change and get a yes first. "Set this up" counts as a yes to the full install. "Just the terminal" means `--no-desktop`.
2. **Back up before you write.** `install.sh` already backs up to `~/.config/cosmos/backup/`. If you do any step by hand, back up first in the same way.
3. **No sudo.** Everything installs into `$HOME`. If a system package is missing (for example `python3-pil`), tell the person which command to run; don't run it yourself.
4. **Stay idempotent.** Re-running must not duplicate the `~/.bashrc` block or the terminal profile. Both are guarded by markers: `# >>> cosmos >>>` and `visible-name='Cosmos'`.
5. **Keep the mascot original.** Ouro is an original character. If someone asks to swap in a copyrighted character (from a show, game or film), don't draw or recreate it. Point them to `~/.config/cosmos/mascot/custom.txt` / `custom.png`, where they can put art they made themselves.
6. **Don't edit `claude-code/hooks/make-colors.js` or `make-colors.d.ts`.** They are vendored from Claude Code's plugin tooling.

## 1. Check the system first (read-only)

```bash
cat /etc/os-release | head -3
echo "DE=$XDG_CURRENT_DESKTOP SHELL=$SHELL"
for c in gnome-terminal dconf gsettings curl unzip python3 starship claude; do
  command -v $c >/dev/null && echo "have $c" || echo "no $c"; done
python3 -c "import PIL" 2>/dev/null && echo "have Pillow" || echo "no Pillow"
fc-list | grep -c "JetBrainsMono Nerd Font"
grep -n "cosmos" ~/.bashrc
```

Then pick a path:

| Result | Path |
| --- | --- |
| GNOME + bash + gnome-terminal | [Standard install](#2-standard-install) |
| anything else | [Other systems](#other-systems) |
| `# >>> cosmos >>>` already in `~/.bashrc` | already installed: re-running is safe, or go to [Verify](#3-verify) |

## 2. Standard install

```bash
git clone https://github.com/ziadteama/hermetic-cosmos ~/hermetic-cosmos   # skip if already cloned
~/hermetic-cosmos/install.sh            # or: install.sh --no-desktop
```

In order, `install.sh`:

1. backs up `~/.bashrc`, the gnome-terminal dconf tree and the wallpaper/colour-scheme keys to `~/.config/cosmos/backup/` (only the first time)
2. copies `terminal/greet.sh`, `quotes.txt` and `mascot/*` to `~/.config/cosmos/`, and links `~/.local/bin/ouro`
3. installs JetBrainsMono Nerd Font v3.2.1 to `~/.local/share/fonts/JetBrainsMonoNF/`, if missing
4. installs Starship v1.20.1 to `~/.local/bin/starship`, if missing, and copies `terminal/starship.toml` to `~/.config/starship.toml` (backing up an existing one)
5. creates the **Cosmos** gnome-terminal profile and makes it the default, if no profile of that name exists
6. appends the marked block to `~/.bashrc`, if not present
7. unless `--no-desktop`: renders `~/.config/cosmos/wallpaper-4k.png` with `terminal/wallpaper.py`, sets it as the wallpaper, and sets `prefer-dark`

Then the Claude Code mod, if the person uses Claude Code:

```bash
claude plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos
```

Tell the person to restart Claude Code. Optionally suggest `/theme` → **Dark mode (ANSI colors only)**, so Claude Code's orange takes on the Cosmos palette.

## 3. Verify

Run these. They don't change anything:

```bash
bash -n ~/.bashrc && echo "bashrc ok"
bash -c 'echo ok'                                  # must print only "ok": no greeting outside interactive shells
~/.config/cosmos/greet.sh | sed 's/\x1b\[[0-9;]*m//g' | head -8
starship --version
gsettings get org.gnome.Terminal.ProfilesList default
dconf dump /org/gnome/terminal/legacy/profiles:/ | grep -c "visible-name='Cosmos'"   # 1
claude plugin list 2>/dev/null | grep -A2 hermetic-cosmos
```

Then ask the person to open a new terminal window and confirm they see Ouro and the `△` / `▽` prompt, with no empty boxes. Report what you checked and what you couldn't, such as visuals you can't see.

## 4. Roll back

```bash
~/hermetic-cosmos/uninstall.sh
claude plugin uninstall hermetic-cosmos
```

`uninstall.sh` removes the `~/.bashrc` block (saving a copy first), deletes the Cosmos profile, and makes the remaining profile the default. It also restores the wallpaper, the colour scheme and `starship.toml` from the backups. It leaves the font, the Starship binary and `~/.config/cosmos/` in place, and prints the commands to remove them.

## Other systems

The parts are independent, so wire up only the ones that fit.

| System | What to do |
| --- | --- |
| **zsh** | Put the same block in `~/.zshrc`, with `[[ -o interactive ]]` instead of `[[ $- == *i* ]]` and `starship init zsh`. `greet.sh` runs under bash on its own shebang. |
| **fish** | Add to `~/.config/fish/config.fish`: `if status is-interactive; ~/.config/cosmos/greet.sh; starship init fish \| source; end` |
| **KDE Konsole** | Skip the dconf step. Make a `.colorscheme` file in `~/.local/share/konsole/` from the palette below. |
| **Kitty / Alacritty / WezTerm / Ghostty** | Skip the dconf step and set the 16 colours, background, foreground, cursor and font in that terminal's config. |
| **macOS** | Skip dconf, gsettings and the font zip. Install with `brew install starship font-jetbrains-mono-nerd-font`. Set the wallpaper by hand. |
| **No GNOME** | Run `install.sh --no-desktop`, or set the PNG from `wallpaper.py` with the desktop's own tool. |

The terminal palette, ANSI 0 to 15:

```
#1d1a3a #e07a5f #4fb3a9 #d4af37 #8a6bd1 #c77d9b #7fb7d6 #c0c8d8
#3a3566 #f09a82 #7fd1c8 #e8c95e #a98ee6 #e0a0bc #a6d4ec #ece6d6
```

- background `#0b0a1a`
- foreground `#ece6d6`
- cursor `#d4af37`
- selection `#3a3566`

## Editing the theme

### Terminal pieces (`terminal/`)

- **`greet.sh`** prints the art from `mascot/ouro-<mood>.txt`, or `custom.txt` if present, side by side with the date, the moon phase and a random line from `quotes.txt`.
  - Moods: `greet` (default), `think`, `error`, `dj`. With no argument it picks `dj` when an MPRIS player reports `Playing` (checked with `busctl`).
  - Colour tokens: `{g}` gold, `{t}` teal, `{v}` violet, `{s}` silver, `{r}` rose, `{e}` ember, `{m}` moss, `{w}` bark, `{o}` soil, `{R}` root, `{d}` dim, `{0}` reset.
  - Keep art lines under 32 visible characters so the right-hand column lines up.
- **`quotes.txt`**: one `text|author` per line. The author `ouro` marks Ouro's own lines. Use short quotations only.
- **`starship.toml`**: the first prompt line starts with `△`, and the `character` module draws `▽ ❯`.
- **`wallpaper.py`** is deterministic (seeded): `python3 -I wallpaper.py <width> <height> <out.png>`.

After you change files in `terminal/`, copy them to `~/.config/cosmos/` (or re-run `install.sh`) so the live setup matches the repo.

### Claude Code mod (`claude-code/`)

All the behaviour is in `hooks/register.tsx`:

| Hook | What it does |
| --- | --- |
| `session.start` | sets the desktop-app colours, registers `/ouro`, starts the 3 s music poll (`busctl` over MPRIS) that sets `music` and runs the `beat` tick while a player plays |
| `ui.render` `Welcome` | Ouro in place of the logo (DJ Ouro and the track if music is playing) |
| `ui.render` `StatusLine` | the `△ … ☽ … ouro (◡‿◡)` line; mood from state; `dj` while music plays and nothing outranks it (working, error) |
| `ui.render` `AbovePrompt` | the three-row animated DJ Ouro and track, only while `music` is set |
| `ui.render` `Spinner` | the sprouting glyph and *ouro is …* words, animated by a `$.clock.every` tick between `prompt.submit` and `turn.complete` |
| `ui.render` `TurnDuration` | *Bloomed for …* |
| `tool.call` | sets the mood to `error` on a failed tool call, `greet` on success |
| `command.run` `ouro` | `/ouro [think\|error\|dj]` |

- State keys (`mood`, `frame`, `startedAt`, `music`, `beat`) are declared in `types/index.d.ts`. Add any new `$.state` key there too.
- The mod has its own copy of Ouro's art (`MOODS` / `BODY`, and `djArt` / `djMini` for the decks). Keep it in sync with `terminal/mascot/` when you change him. `ouro-dj.txt` is `djArt(0)`.

Check every change before committing:

```bash
claude plugin validate claude-code        # must end in "Validation passed"
claude plugin validate .                  # checks the marketplace file too
```

To try a change live without reinstalling, run `claude --plugin-dir ~/hermetic-cosmos/claude-code`.

### Publishing a change

1. Bump `version` in `claude-code/.claude-plugin/plugin.json`.
2. Commit and run `git push`. Never force-push `main`.
3. Users update with `claude plugin update hermetic-cosmos`, or `/plugin` → update.

Before every push, check that no keys, tokens or personal data were added.
