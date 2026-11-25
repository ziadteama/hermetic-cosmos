<div align="center">

# ✡ Hermetic Cosmos

**As above, so below.**

A pantheist, Hermetic theme for your terminal, your desktop and Claude Code,<br>
looked after by **Ouro**, a sleepy little forest wanderer with roots that reach down to the stars.

`Ubuntu / GNOME` · `bash` · `Claude Code` · `MIT`

</div>

```
  ☽       \ | /
        '-.\|/.-'                 ✡  AS ABOVE, SO BELOW  ✡
            |
       .-~~~~~~~-.                Wed 25 Nov 2026  ·  ☽ full moon
      ( ✿ ~ ~ ~ ✿ )
      |___________|               ouro: mushrooms are just the earth's way
      |   ◡   ◡   |                     of saying hi.
      |    ‿‿     |  o/
       \_________/
     ~~~|   ✶   |~~~  .-^-.
        |       |     '-|-'
 ,\,,/,,|,,,,,,,|,,\,/,,|,,,
════════════════════════════
       /|\     /|\
      / | \   / | \
     ·   ·  ✶   ·   ·

△ ~/projects/cosmos ⟡ ⎇ main ✶~2
▽ ❯
```

---

## Contents

- [The idea](#the-idea)
- [Quick start](#quick-start)
- [What you get](#what-you-get)
- [Requirements](#requirements)
- [Make it yours](#make-it-yours)
- [Uninstall](#uninstall)
- [Troubleshooting](#troubleshooting)
- [Repository layout](#repository-layout)
- [For AI agents](#for-ai-agents)

---

## The idea

The theme follows the old Hermetic maxim from the Emerald Tablet: *that which is above is like that which is below.* Every part of it has an above and a below.

| | Above | Between | Below |
| --- | --- | --- | --- |
| **Colour** | Sun gold `#d4af37` | Nebula violet `#8a6bd1`, the soul | Earth teal `#4fb3a9` |
| **Prompt** | `△` where you are | | `▽` where you type |
| **Ouro** | a sprout reaching for the moon | Ouro himself | roots, with a star in the soil |
| **Wallpaper** | a starry sky | a hexagram on the horizon | the sky reflected in still water |

The full palette:

| Name | Hex | Used for |
| --- | --- | --- |
| Night | `#0b0a1a` | background |
| Parchment | `#ece6d6` | text |
| Sun gold | `#d4af37` | directories, headings, "above" |
| Earth teal | `#4fb3a9` | input line, success, "below" |
| Nebula | `#8a6bd1` | git branch |
| Moon silver | `#c0c8d8` | dates, quiet info |
| Rose | `#c77d9b` | quotes, git changes |
| Ember | `#e07a5f` | errors |
| Moss | `#7fa36b` | Ouro's sprout and grass |
| Bark | `#9a7b55` | soil, a wilted sprout |

---

## Quick start

### 1. Terminal and desktop

```bash
git clone https://github.com/ziadteama/hermetic-cosmos ~/hermetic-cosmos
~/hermetic-cosmos/install.sh
```

Then open a **new** terminal window. To keep your current wallpaper, run `install.sh --no-desktop` instead.

### 2. Claude Code

At the prompt of a terminal Claude Code session:

```
/plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos
```

Answer `y` to add the marketplace, then press **Enter** for the user scope. Or from a shell:

```bash
claude plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos
```

In the desktop app: click **+** next to the prompt box, then **Plugins** → **Add marketplace** with `ziadteama/hermetic-cosmos` → **Add plugin**.

> **Tip:** in Claude Code, run `/theme` and pick **Dark mode (ANSI colors only)**. Claude Code then draws with your terminal's Cosmos palette instead of its own orange.

---

## What you get

### In the terminal

- **Cosmos profile.** A new gnome-terminal profile, set as the default, with the full 16-colour palette, JetBrainsMono Nerd Font and slight transparency. Your old profile is kept.
- **Two-line prompt** (Starship):
  - `△` gold shows the folder, git branch and changes
  - `▽ ❯` teal is where you type, and turns ember with the exit code after a failed command
- **Ouro's greeting.** Every new terminal shows Ouro, the date, the moon phase and a random line from the Emerald Tablet, Spinoza, Heraclitus, the Upanishads, Blake, Muir, or Ouro himself.
- **`ouro` command.** `ouro`, `ouro think` and `ouro error` show his three moods.

### On the desktop

- **Mirror wallpaper** (4K, drawn on your machine). A starry sky and crescent moon reflected in still water, with a gold and teal hexagram sitting on the horizon.
- **Dark mode**, turned on.

### In Claude Code

| Where | What changes |
| --- | --- |
| Welcome screen | Ouro replaces the logo, with the moon phase and a quote |
| Status line | `△ as above ⟡ ☽ full moon ⟡ ouro (◡‿◡) all is one, bro` |
| Working line | the orange star becomes a seed that sprouts, blooms and turns into the moon: *✿ ouro is asking the mushrooms… (14s)* |
| End of a turn | *Bloomed for 12s*, *Composted for 1m 4s* instead of *Baked* |
| Tool errors | Ouro wilts `(×o×)` until the next success |
| `/ouro` | shows Ouro's full art; `/ouro think`, `/ouro error` |
| Desktop app | a night-indigo and gold colour theme |

---

## Requirements

| Part | Needs |
| --- | --- |
| Installer | Ubuntu 22.04+ (or another GNOME distro), bash, `curl`, `unzip`, `python3` with Pillow (`python3-pil`), `dconf`, `gsettings` |
| Claude Code mod | a Claude Code build that supports hooks-module plugins |

The installer needs no sudo. Everything goes into your home folder:

- `~/.config/cosmos/`
- `~/.local/bin/`
- `~/.local/share/fonts/`
- `~/.config/starship.toml`
- one marked block in `~/.bashrc`

Using zsh, fish, KDE or macOS? The pieces still work, they just need wiring by hand. See [AGENTS.md](AGENTS.md#other-systems).

---

## Make it yours

| Want to… | Do this |
| --- | --- |
| Add quotes | Add lines to `~/.config/cosmos/quotes.txt` as `text\|author`. Use the author `ouro` to make it Ouro's line. |
| Use your own mascot | Put your own art in `~/.config/cosmos/mascot/custom.txt`, or `custom.png` (needs `chafa`). Delete it to bring Ouro back. |
| Silence the greeting once | `COSMOS_QUIET=1 bash` |
| Change the prompt | Edit `~/.config/starship.toml` |
| Change Claude Code's words | Edit the `SPIN` (working line) and `DONE` (end of turn) lists in `claude-code/hooks/register.tsx` |
| Redraw the wallpaper | `python3 terminal/wallpaper.py 3840 2400 ~/.config/cosmos/wallpaper-4k.png` |

Colour tokens you can use in mascot `.txt` files: `{g}` gold, `{t}` teal, `{v}` violet, `{s}` silver, `{r}` rose, `{e}` ember, `{m}` moss, `{w}` bark, `{o}` soil, `{R}` root, `{d}` dim, `{0}` reset.

---

## Uninstall

```bash
~/hermetic-cosmos/uninstall.sh
```

The uninstaller:

- removes the `~/.bashrc` block
- switches the terminal back to your previous profile and deletes the Cosmos one
- restores your wallpaper, colour scheme and Starship config from `~/.config/cosmos/backup/`

It leaves the font, the Starship binary and `~/.config/cosmos/` in place. The last lines it prints say how to remove those too.

For Claude Code:

```bash
claude plugin uninstall hermetic-cosmos
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Symbols show as empty boxes | Log out and back in so the new font loads. Check that Terminal → Preferences → Cosmos uses *JetBrainsMono Nerd Font*. |
| No greeting or prompt in a new terminal | Run `grep -n cosmos ~/.bashrc`. The block must be there and your terminal must start an interactive bash. |
| The old profile still opens | Terminal → Preferences → click the ▾ next to *Cosmos* → **Set as default**. |
| Claude Code still looks orange | Run `/theme` → **Dark mode (ANSI colors only)**, then restart Claude Code. |
| Ouro shows twice in Claude Code | A dev copy and the installed copy are both loaded. Restart Claude Code. |
| `wallpaper.py` fails | Run `sudo apt install python3-pil`. |

---

## Repository layout

```
hermetic-cosmos/
├── .claude-plugin/marketplace.json   makes this repo installable as a Claude Code marketplace
├── claude-code/                      the Claude Code mod
│   ├── .claude-plugin/plugin.json
│   ├── hooks/register.tsx            all of the mod's behaviour
│   ├── hooks/make-colors.js          desktop-app colour helper (vendored, do not edit)
│   └── types/index.d.ts              the mod's state contract
├── terminal/
│   ├── greet.sh                      Ouro + quote + moon phase
│   ├── mascot/ouro-*.txt             Ouro's three moods, with colour tokens
│   ├── quotes.txt
│   ├── starship.toml                 the △ / ▽ prompt
│   └── wallpaper.py                  draws the mirror wallpaper (Pillow)
├── install.sh
├── uninstall.sh
├── AGENTS.md                         setup and editing guide for AI coding agents
└── CLAUDE.md                         points Claude Code at AGENTS.md
```

---

## For AI agents

If you're an AI coding agent (Claude Code, Codex, Antigravity, Cursor…) asked to set this up, read **[AGENTS.md](AGENTS.md)** first. It covers checking the system, the order of steps, what to back up, how to verify, and how to roll back.

---

<div align="center">

MIT licensed · Ouro is an original character · the greeting uses short quotations from classic texts and writers

*bro… you're basically stardust with wifi.*

</div>
