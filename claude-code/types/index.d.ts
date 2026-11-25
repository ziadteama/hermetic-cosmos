export type Mood = 'greet' | 'think' | 'error'

declare module 'claude-code' {
  interface PluginState {
    'hermetic-cosmos': { mood: Mood; frame: number; startedAt: number }
  }
}
