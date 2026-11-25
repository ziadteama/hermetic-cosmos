# Hermetic Cosmos ✡

*As above, so below.* A pantheist, Hermetic theme for your terminal, your desktop and Claude Code. It comes with **Ouro**, a sleepy little forest wanderer with a sprout on his head, a mushroom buddy, and roots that reach down to a star buried in the soil.

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
```

## Claude Code mod

In Claude Code, Ouro replaces the welcome logo, with the moon phase and a line from the Emerald Tablet, Spinoza, Heraclitus or Ouro himself.

- **Status line:** shows `△ as above ⟡ ☽ full moon ⟡ ouro (◡‿◡)`. Ouro's face changes while Claude works, and he wilts when a tool call fails.
- **Working line:** the orange star becomes a seed that sprouts, blooms and turns into the moon, with words like *ouro is asking the mushrooms…*
- **End of a turn:** reads *Bloomed for 12s* instead of *Baked*.
- **`/ouro` command:** calls him up. Try `/ouro think` and `/ouro error`.
- **Desktop app:** gets a night-indigo and gold color theme.

Install it at the prompt of a terminal Claude Code session:

```
/plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos
```

Answer `y` to add the marketplace, then press Enter for the user scope. From a shell:

```
claude plugin install hermetic-cosmos --marketplace ziadteama/hermetic-cosmos
```

In the desktop app: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `ziadteama/hermetic-cosmos`, then **Add plugin**.

Tip: run `/theme` and pick **Dark mode (ANSI colors only)**, so Claude Code uses the terminal palette below instead of its own orange.

## Terminal and desktop (Ubuntu / GNOME, bash)

```
git clone https://github.com/ziadteama/hermetic-cosmos ~/hermetic-cosmos
~/hermetic-cosmos/install.sh          # add --no-desktop to skip the wallpaper
```

The installer:

- backs up your settings to `~/.config/cosmos/backup/`
- installs JetBrainsMono Nerd Font and the Starship prompt into your home folder (no sudo)
- adds a **Cosmos** gnome-terminal profile and the two-line △ / ▽ prompt
- shows Ouro and a random quote in every new terminal
- draws the mirror wallpaper: a starry sky reflected in still water, with a gold and teal hexagram on the horizon

You can re-run it safely.

| Colour | Hex | Meaning |
| --- | --- | --- |
| Night | `#0b0a1a` | background |
| Sun gold | `#d4af37` | above |
| Earth teal | `#4fb3a9` | below |
| Nebula | `#8a6bd1` | the soul between |
| Moss | `#7fa36b` | Ouro's sprout |
| Ember | `#e07a5f` | errors |

**Make it yours.** Add lines to `~/.config/cosmos/quotes.txt` (`text|author`). To swap in your own mascot, put a `custom.txt` or `custom.png` in `~/.config/cosmos/mascot/`.

**Undo.** Delete the `# >>> cosmos >>>` block from `~/.bashrc`, pick your old profile in Terminal → Preferences, and restore the wallpaper from `~/.config/cosmos/backup/desktop.txt`.

## Layout

- `claude-code/`: the Claude Code mod (`hooks/register.tsx`)
- `terminal/`: greeting, Ouro's art, quotes, Starship config, wallpaper generator
- `install.sh`: the terminal and desktop installer

MIT licensed. Ouro is an original character.
