export type Mood = 'greet' | 'think' | 'error' | 'dj'

/** What a media player (Spotify, a browser, VLC…) reports as playing, over MPRIS. */
export type Track = { title: string; artist: string; player: string }

declare module 'claude-code' {
  interface PluginState {
    'hermetic-cosmos': {
      mood: Mood; frame: number; startedAt: number
      /** the track playing now, or null when nothing is: Ouro is on the decks only while this is set */
      music: Track | null
      /** the DJ animation's beat counter, ticking only while music plays */
      beat: number
    }
  }
}
