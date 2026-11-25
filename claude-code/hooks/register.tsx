import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Mood, Track } from '../types'
import { makeColors } from './make-colors.js'

// ---------- palette ----------
const C = {
  night: '#0b0a1a', parchment: '#ece6d6', dim: '#a9a3b8', gold: '#d4af37', teal: '#4fb3a9',
  violet: '#8a6bd1', silver: '#c0c8d8', ember: '#e07a5f', rose: '#c77d9b', moss: '#7fa36b',
  bark: '#9a7b55', soil: '#6e5a40', root: '#2f7d75',
}
const TOKEN: Record<string, string> = {
  s: C.silver, m: C.moss, r: C.rose, g: C.gold, t: C.teal, e: C.ember, w: C.bark,
  o: C.soil, R: C.root, v: C.violet, d: C.dim,
}

// ---------- Ouro (original mascot), same art as ~/.config/cosmos/mascot ----------
const BODY = [
  '       {m}.-~~~~~~~-.{0}',
  '      {m}({0} {r}✿{0} {m}~ ~ ~{0} {r}✿{0} {m}){0}',
  '      {m}|___________|{0}',
  'EYES',
  'MOUTH',
  '       \\_________/',
  "     {m}~~~{0}|   {g}✶{0}   |{m}~~~{0}  {e}.-^-.{0}",
  "        |       |     {e}'-{0}|{e}-'{0}",
  '{m} ,\\,,/,,{0}|{m},,,,,,,{0}|{m},,\\,/,,{0}|{m},,,{0}',
  '{o}════════════════════════════{0}',
  '{R}       /|\\     /|\\{0}',
  '{R}      / | \\   / | \\{0}',
  '     {R}·   ·{0}  {g}✶{0}   {R}·   ·{0}',
]
const MOODS: Record<Exclude<Mood, 'dj'>, { top: string[]; eyes: string; mouth: string; face: string }> = {
  greet: {
    top: ['  {s}☽{0}       {m}\\ | /{0}', "        {m}'-.\\|/.-'{0}", '            {m}|{0}'],
    eyes: '      |   {g}◡{0}   {g}◡{0}   |', mouth: '      |    ‿‿     |  {t}o/{0}', face: '(◡‿◡)',
  },
  think: {
    top: ['  {s}☽{0}   {v}?{0}   {m}\\ | /{0}', "        {m}'-.\\|/.-'{0}", '            {m}|{0}'],
    eyes: '      |   {g}•{0}   {g}•{0}   |', mouth: '      |    ~~     |  {s}.oO{0}', face: '(•~•)',
  },
  error: {
    top: ['  {s}☽{0}       {w}, | ,{0}', "        {w}' ,\\|/, '{0}", '            {w}|{0}'],
    eyes: '      |   {e}×{0}   {e}×{0}   |', mouth: '      |    {e}o{0}      |  {e}!{0}', face: '(×o×)',
  },
}
const art = (mood: Mood, beat = 0): string[] => {
  if (mood === 'dj') return djArt(beat)
  const m = MOODS[mood]
  return [...m.top, ...BODY.map(l => (l === 'EYES' ? m.eyes : l === 'MOUTH' ? m.mouth : l))]
}

// ---------- DJ Ouro: only while music plays ----------
// a vine headband with flower ear cups, two wooden decks with spinning records,
// and on beats 1 and 3 one hand goes up to hold a cup to his ear
const REC = ['◐', '◓', '◑', '◒']
const NOTES = [
  '  {s}☽{0}  {v}♪{0}    {m}\\ | /{0}    {t}♬{0}',
  '  {s}☽{0}    {t}♬{0}  {m}\\ | /{0}  {v}♪{0}',
  '  {s}☽{0} {g}♫{0}     {m}\\ | /{0}     {v}♪{0}',
  '  {s}☽{0}   {v}♪{0}   {m}\\ | /{0}   {t}♬{0}',
]
const djArt = (beat: number): string[] => {
  const b = ((beat % 4) + 4) % 4
  const L = b === 1, R = b === 3
  const eye = b % 2 ? '◡' : '◠'
  const rl = REC[b] ?? '◐', rr = REC[(b + 2) % 4] ?? '◑'
  const crown = b % 2 ? '{m}( ~{0} {r}✿{0} {m}~{0} {r}✿{0} {m}~ ){0}' : '{m}({0} {r}✿{0} {m}~ ~ ~{0} {r}✿{0} {m}){0}'
  return [
    NOTES[b] ?? NOTES[0]!,
    "        {m}'-.\\|/.-'{0}",
    '     {m}╭~~~~~~|~~~~~~╮{0}',
    '     {m}│ .-~~~~~~~-. │{0}',
    `     {m}│{0}${crown}{m}│{0}`,
    '    {w}╭{m}┴|___________|┴{w}╮{0}',
    `${L ? '   {t}o' : '    '}{w}│{r}✿{0}|   {g}${eye}{0}   {g}${eye}{0}   |{r}✿{w}│{0}${R ? '{t}o{0}' : ''}`,
    `${L ? '   {t}│' : '    '}{w}╰─{0}|    ‿‿     |{w}─╯{0}${R ? '{t}│{0}' : ''}`,
    `${L ? '   {t}╰~~~{0}' : '       '}\\_________/${R ? '{t}~~~╯{0}' : ''}`,
    `${L ? '        ' : '     {m}~~╮{0}'}|   {g}✶{0}   |${R ? '   ' : '{m}╭~~{0}'}  {e}.-^-.{0}`,
    `    {s}${rl}{w}══${L ? ' ' : '{m}╧'}{0}|       |${R ? ' ' : '{m}╧'}{w}══{s}${rr}{0} {e}'-{0}|{e}-'{0}`,
    ...BODY.slice(8),
  ]
}
// the same, three rows tall, for the band above the prompt
const djMini = (beat: number): string[] => {
  const b = ((beat % 4) + 4) % 4
  const L = b === 1, R = b === 3
  const eye = b % 2 ? '◡' : '◠'
  const rl = REC[b] ?? '◐', rr = REC[(b + 2) % 4] ?? '◑'
  const [n1, n2] = b % 2 ? ['{t}♬{0}', '{v}♪{0}'] : ['{v}♪{0}', '{t}♬{0}']
  return [
    `${n1}  {m}╭~~|~~╮{0}  ${n2}`,
    `${L ? '  {t}o' : '   '}{r}✿{m}({g}${eye}{0}‿{g}${eye}{m}){r}✿{0}${R ? '{t}o{0} ' : '  '}  `,
    `  {s}${rl}{w}═${L ? ' ' : '{m}╛'}{0}   ${R ? ' ' : '{m}╘'}{w}═{s}${rr}{0}  `,
  ]
}
const djFace = (beat: number): string => (beat % 2 ? '♬(◡‿◡)♪' : '♪(◠‿◠)♬')

// what's playing, asked of every MPRIS player on the session bus (Linux; elsewhere busctl is
// missing, the first poll fails and polling stops)
const BUS = ['busctl', '--user', '--json=short']
const MPRIS_PATH = '/org/mpris/MediaPlayer2'
const PLAYER_IFACE = 'org.mpris.MediaPlayer2.Player'
type Run = (argv: readonly string[], init?: { timeoutMs?: number }) => Promise<{ exitCode: number; stdout: string }>
const busJson = async (run: Run, args: string[]): Promise<unknown> => {
  const r = await run([...BUS, ...args], { timeoutMs: 2000 })
  if (r.exitCode !== 0) return undefined
  try { return (JSON.parse(r.stdout) as { data?: unknown }).data } catch { return undefined }
}
const nowPlaying = async (run: Run): Promise<Track | null> => {
  const names = await busJson(run, ['call', 'org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus', 'ListNames'])
  const list = Array.isArray(names) && Array.isArray(names[0]) ? (names[0] as unknown[]) : []
  const players = list
    .filter((n): n is string => typeof n === 'string' && n.startsWith('org.mpris.MediaPlayer2.'))
    .sort((a, b) => Number(b.includes('spotify')) - Number(a.includes('spotify')))
  for (const p of players) {
    if ((await busJson(run, ['get-property', p, MPRIS_PATH, PLAYER_IFACE, 'PlaybackStatus'])) !== 'Playing') continue
    const meta = (await busJson(run, ['get-property', p, MPRIS_PATH, PLAYER_IFACE, 'Metadata'])) as
      Record<string, { data?: unknown }> | undefined
    const title = meta?.['xesam:title']?.data
    const artists = meta?.['xesam:artist']?.data
    return {
      title: typeof title === 'string' && title ? title : 'something good',
      artist: Array.isArray(artists) ? artists.filter(a => typeof a === 'string').join(', ') : '',
      player: p.split('.')[3] ?? 'music',
    }
  }
  return null
}
const sameTrack = (a: Track | null, b: Track | null): boolean =>
  a === b || (!!a && !!b && a.title === b.title && a.artist === b.artist && a.player === b.player)
type Seg = { text: string; color?: string }
const segs = (line: string): Seg[] => {
  const out: Seg[] = []
  let color: string | undefined
  for (const part of line.split(/(\{[a-zA-Z0-9]\})/)) {
    const tok = /^\{([a-zA-Z0-9])\}$/.exec(part)
    if (tok) { const k = tok[1] ?? '0'; color = k === '0' ? undefined : TOKEN[k] }
    else if (part) out.push({ text: part, color })
  }
  return out
}

// ---------- words ----------
const QUOTES: [string, string][] = [
  ['That which is below is like that which is above.', 'Emerald Tablet'],
  ['Deus sive Natura. God, or Nature.', 'Spinoza'],
  ['All things are one.', 'Heraclitus'],
  ['Thou art That.', 'Chandogya Upanishad'],
  ['Constantly regard the universe as one living being.', 'Marcus Aurelius'],
  ['The All is Mind; the Universe is Mental.', 'The Kybalion'],
  ['To see a world in a grain of sand, and a heaven in a wild flower.', 'William Blake'],
  ['The clearest way into the Universe is through a forest wilderness.', 'John Muir'],
  ["bro… you're basically stardust with wifi.", 'ouro'],
  ["mushrooms are just the earth's way of saying hi.", 'ouro'],
  ['i put my roots down and found a star. like, in the dirt, man.', 'ouro'],
  ['i grew a little overnight. so did the moss. so did the galaxy.', 'ouro'],
]
const SPIN = ['Photosynthesizing', 'Communing with the moss', 'Rooting', 'Composting', 'Stargazing',
  'Transmuting', 'Mycelium-ing', 'Mirroring the heavens', 'Unfurling', 'Germinating', 'Orbiting',
  'Dreaming the world', 'Asking the mushrooms', 'Sprouting', 'Moon-bathing', 'Listening to the roots',
  'Becoming one', 'Rustling', 'Pollinating', 'Drifting through the cosmos', 'Soaking up starlight',
  'Watering the galaxy', 'Vibing with the trees', 'Channeling the All']
const DONE = ['Grew', 'Sprouted', 'Bloomed', 'Composted', 'Photosynthesized', 'Rooted', 'Stargazed',
  'Unfurled', 'Transmuted', 'Blossomed', 'Ripened', 'Orbited']
const PHASES = ['new moon', 'waxing crescent', 'first quarter', 'waxing gibbous', 'full moon',
  'waning gibbous', 'last quarter', 'waning crescent']
const moonPhase = (ms: number): string => {
  const syn = 2551443000
  const age = (((ms - 947182440000) % syn) + syn) % syn / syn * 30
  return PHASES[Math.floor((age * 8 + 15) / 30) % 8] ?? 'moon'
}

// ---------- desktop / mobile look ----------
const { theme } = makeColors({
  label: 'Hermetic Cosmos',
  roles: { accent: C.gold, danger: C.ember, success: C.moss, warning: '#d9a441', pro: C.violet },
  only: 'dark',
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0a1a', 'surface-1': '#121029', 'surface-2': '#181533', 'surface-3': '#1c1938',
        'text-primary': C.parchment, 'text-secondary': '#cfc8d8', 'text-muted': '#a9a3b8',
      },
    },
  },
})

const mood = atom({ plugin: 'hermetic-cosmos', key: 'mood' } as const, 'greet' as Mood)
const frame = atom({ plugin: 'hermetic-cosmos', key: 'frame' } as const, 0)
const startedAt = atom({ plugin: 'hermetic-cosmos', key: 'startedAt' } as const, 0)
const music = atom({ plugin: 'hermetic-cosmos', key: 'music' } as const, null as Track | null)
const beat = atom({ plugin: 'hermetic-cosmos', key: 'beat' } as const, 0)

// a seed sprouting into a flower, then the moon turning, in place of Claude's orange star
const GLYPHS: [string, string][] = [
  ['·', C.bark], ['˙', C.bark], ['ᵥ', C.moss], ['ψ', C.moss], ['Ψ', C.moss], ['✿', C.rose],
  ['❀', C.rose], ['✿', C.rose], ['☽', C.silver], ['◐', C.silver], ['○', C.gold], ['◑', C.silver],
  ['☾', C.silver], ['✶', C.gold], ['✦', C.gold], ['·', C.violet],
]
const fmt = (ms: number): string => {
  const sec = Math.max(0, Math.floor(ms / 1000))
  return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`
}

export const register: Register = on => {
  let quoteIdx = 0

  // ---- music watch: poll the players every 3s; while one plays, the beat ticks and Ouro DJs ----
  let poll: { cancel(): void } | undefined
  let groove: { cancel(): void } | undefined
  let polling = false

  on('session.start', async ($, e, next) => {
    const now = await $.clock.now()
    quoteIdx = Math.floor(now / 1000) % QUOTES.length
    await update($, mood, () => 'greet' as Mood)

    const check = async () => {
      if (polling) return
      polling = true
      try {
        const track = await nowPlaying((argv, init) => $.process.run(argv, init))
        if (!sameTrack(await read($, music), track)) await update($, music, () => track)
        if (track && !groove) groove = $.clock.every(450, () => { void update($, beat, n => (n + 1) % 10000) })
        if (!track && groove) { groove.cancel(); groove = undefined }
      } catch (err) {
        // no busctl / no session bus: stop asking, stay idle
        poll?.cancel(); poll = undefined
        groove?.cancel(); groove = undefined
        await update($, music, () => null)
        $.ui.log(`ouro can't hear the music here: ${String(err)}`, { to: 'debug' })
      } finally {
        polling = false
      }
    }
    poll?.cancel()
    poll = $.clock.every(3000, () => { void check() })
    void check()
    try {
      await $.theme.set({ colors: theme })
    } catch (err) {
      $.ui.log(String(err))
    }
    await $.command.register({ name: 'ouro', description: 'Say hi to Ouro (try: /ouro think, /ouro error, /ouro dj)' })
    return next(e)
  })

  // Ouro replaces the logo on the welcome screen
  on('ui.render', { component: 'Welcome' }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const track = await read($, music)
    const lines = track ? art('dj', await read($, beat)) : art('greet')
    const [q, who] = QUOTES[quoteIdx] ?? QUOTES[0]!
    const phase = moonPhase(await $.clock.now())
    const side: Seg[][] = [
      [],
      [{ text: '✡  AS ABOVE, SO BELOW  ✡', color: C.gold }],
      [],
      [{ text: `Claude Code v${e.props.version}`, color: C.parchment }, { text: `  ·  ${e.props.model}`, color: C.dim }],
      [{ text: e.props.cwd, color: C.dim }],
      [{ text: `☽ ${phase}`, color: C.silver }],
      track ? [{ text: '♪ ', color: C.violet }, { text: track.title, color: C.teal }, { text: track.artist ? ` — ${track.artist}` : '', color: C.dim }] : [],
      who === 'ouro'
        ? [{ text: 'ouro: ', color: C.teal }, { text: q, color: C.dim }]
        : [{ text: `“${q}”`, color: C.rose }],
      who === 'ouro' ? [] : [{ text: `    — ${who}`, color: C.dim }],
    ]
    return (
      <Box flexDirection="row" gap={4}>
        <Box flexDirection="column" flexShrink={0}>
          {lines.map((l, i) => (
            <Text key={`a${i}`}>{segs(l).map((s, j) => <Text key={`s${j}`} color={s.color}>{s.text}</Text>)}</Text>
          ))}
        </Box>
        <Box flexDirection="column" flexShrink={1}>
          {side.map((row, i) => (
            <Text key={`b${i}`}>{row.length === 0 ? ' ' : row.map((s, j) => <Text key={`t${j}`} color={s.color}>{s.text}</Text>)}</Text>
          ))}
        </Box>
      </Box>
    )
  })

  // status line: △ above · ☽ moon · Ouro's face, which reacts to what's happening
  on('ui.render', { component: 'StatusLine' }, async ($, e, next) => {
    if (e.props.isManaged) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const track = await read($, music)
    const stored = await read($, mood)
    // working wins, then a fresh error, then the decks while music plays, then idle
    const m: Mood = e.props.isWorking ? 'think' : stored === 'error' ? 'error' : track ? 'dj' : stored
    const phase = moonPhase(await $.clock.now())
    const faceColor = m === 'error' ? C.ember : m === 'think' ? C.violet : m === 'dj' ? C.teal : C.moss
    const face = m === 'dj' ? djFace(await read($, beat)) : MOODS[m].face
    const said = m === 'error' ? 'stuff composts. stuff grows back.' : m === 'think' ? 'growing…'
      : m === 'dj' && track ? `spinning ${track.title}${track.artist ? ` — ${track.artist}` : ''}` : 'all is one, bro'
    return (
      <Box>
        <Text>
          <Text color={C.gold}>△ as above </Text>
          <Text color={C.dim}>⟡ </Text>
          <Text color={C.silver}>☽ {phase} </Text>
          <Text color={C.dim}>⟡ </Text>
          <Text color={faceColor}>ouro {face} </Text>
          <Text color={C.dim} italic>{said}</Text>
        </Text>
      </Box>
    )
  })

  // the working line: Ouro's growing sprout in place of the orange star, his words, the time
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'terminal') {
      const now = await $.clock.now()
      const w = SPIN[Math.floor(now / 8000) % SPIN.length] ?? 'growing'
      return next({ ...e, props: { ...e.props, word: `ouro is ${w.toLowerCase()}` } })
    }
    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()
    const f = await read($, frame)
    const start = (await read($, startedAt)) || now
    const [glyph, color] = GLYPHS[Math.floor(f / 2) % GLYPHS.length] ?? ['✶', C.gold]
    const w = SPIN[Math.floor((now - start) / 8000 + start / 1000) % SPIN.length] ?? 'growing'
    const text = e.props.message ?? `ouro is ${w.toLowerCase()}`
    return (
      <Box>
        <Text>
          <Text color={color}>{glyph} </Text>
          <Text color={C.gold}>{text}</Text>
          <Text color={C.dim}>{e.props.suffix} ({fmt(now - start)} · esc to interrupt)</Text>
        </Text>
      </Box>
    )
  })

  // DJ Ouro above the prompt, only while music plays and nothing else needs the band
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const track = await read($, music)
    if (!track || e.props.hasSurvey) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const rows = djMini(await read($, beat))
    const side: Seg[][] = [
      [{ text: "ouro's on the decks", color: C.gold, }],
      [{ text: '♪ ', color: C.violet }, { text: track.title, color: C.teal }],
      [{ text: track.artist ? `  ${track.artist} · ${track.player}` : `  via ${track.player}`, color: C.dim }],
    ]
    return (
      <Box flexDirection="row" gap={2}>
        <Box flexDirection="column" flexShrink={0}>
          {rows.map((l, i) => (
            <Text key={`d${i}`}>{segs(l).map((s, j) => <Text key={`s${j}`} color={s.color}>{s.text}</Text>)}</Text>
          ))}
        </Box>
        <Box flexDirection="column" flexShrink={1}>
          {side.map((row, i) => (
            <Text key={`m${i}`} wrap="truncate-end">{row.map((s, j) => <Text key={`t${j}`} color={s.color}>{s.text}</Text>)}</Text>
          ))}
        </Box>
      </Box>
    )
  })

  let tick: { cancel(): void } | undefined
  const stopTick = () => { tick?.cancel(); tick = undefined }

  on('turn.complete', async ($, e, next) => {
    stopTick()
    return next(e)
  })

  // the closing line of a turn: "Baked for 3s" -> "Bloomed for 3s"
  on('ui.render', { component: 'TurnDuration' }, async ($, e, next) => {
    const word = DONE[Math.floor(e.props.durationMs / 997) % DONE.length] ?? e.props.word
    return next({ ...e, props: { ...e.props, word } })
  })

  // Ouro reacts to tool results: wilts on an error, perks up on success
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    const failed = ran.deny === undefined && ran.isError === true
    await update($, mood, () => (failed ? 'error' : 'greet') as Mood)
    return ran
  })

  on('prompt.submit', async ($, e, next) => {
    await update($, mood, () => 'greet' as Mood)
    await update($, startedAt, () => 0)
    const t0 = await $.clock.now()
    await update($, startedAt, () => t0)
    stopTick()
    tick = $.clock.every(120, () => { void update($, frame, n => (n + 1) % 10000) })
    return next(e)
  })

  on('command.run', { command: 'ouro' }, async ($, e) => {
    const arg = e.args.trim()
    const m: Mood = arg === 'think' || arg === 'error' || arg === 'dj' ? arg : 'greet'
    const [q, who] = QUOTES[Math.floor((await $.clock.now()) / 1000) % QUOTES.length] ?? QUOTES[0]!
    const plain = art(m).map(l => l.replace(/\{[a-zA-Z0-9]\}/g, '')).join('\n')
    const line = who === 'ouro' ? `ouro: ${q}` : `“${q}” — ${who}`
    return { text: `${plain}\n\n${line}`, isTextDisplayOnly: true }
  })
}
