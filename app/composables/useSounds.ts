const SOUNDS = {
  hover: { src: '/sounds/legacy/hover_sound.aac', volume: 1 },
  focusIn: { src: '/sounds/legacy/focus-in.aac', volume: 0.01 },
  focusOut: { src: '/sounds/legacy/focus-out.aac', volume: 0.01 },
} as const

export type SoundName = keyof typeof SOUNDS

const MUSIC_SRC = '/musics/legacy/moments_like_this.aac'

const DEFAULT_SOUND_VOLUME = 0
const DEFAULT_MUSIC_VOLUME = 0
const FALLBACK_SOUND_VOLUME = 50
const FALLBACK_MUSIC_VOLUME = 30
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 an

let music: HTMLAudioElement | null = null
const soundCache = new Map<SoundName, HTMLAudioElement>()
let initialized = false
let waitingForInteraction = false

const toGain = (volume: number) => Math.min(Math.max(volume / 100, 0), 1) ** 2

export function useSounds() {
  const soundCookie = useCookie<number>('sound-volume', {
    default: () => DEFAULT_SOUND_VOLUME,
    maxAge: COOKIE_MAX_AGE,
  })
  const musicCookie = useCookie<number>('music-volume', {
    default: () => DEFAULT_MUSIC_VOLUME,
    maxAge: COOKIE_MAX_AGE,
  })

  const soundVolume = useState<number>('sound-volume', () => Number(soundCookie.value) || 0)
  const musicVolume = useState<number>('music-volume', () => Number(musicCookie.value) || 0)
  const isMusicPlaying = useState<boolean>('music-playing', () => false)

  const lastSoundVolume = useState<number>('last-sound-volume', () => soundVolume.value || FALLBACK_SOUND_VOLUME)
  const lastMusicVolume = useState<number>('last-music-volume', () => musicVolume.value || FALLBACK_MUSIC_VOLUME)

  const isSoundMuted = computed(() => soundVolume.value === 0)
  const isMusicMuted = computed(() => musicVolume.value === 0)

  // --- Musique ---------------------------------------------------------------

  function getMusic() {
    if (!import.meta.client) return null
    if (!music) {
      music = new Audio(MUSIC_SRC)
      music.loop = true
      music.preload = 'auto'
      music.volume = toGain(musicVolume.value)
      music.addEventListener('play', () => (isMusicPlaying.value = true))
      music.addEventListener('pause', () => (isMusicPlaying.value = false))
    }
    return music
  }

  function retryOnInteraction() {
    if (waitingForInteraction) return
    waitingForInteraction = true
    const retry = () => {
      waitingForInteraction = false
      window.removeEventListener('pointerdown', retry)
      window.removeEventListener('keydown', retry)
      if (musicVolume.value > 0) playMusic()
    }
    window.addEventListener('pointerdown', retry, { once: true })
    window.addEventListener('keydown', retry, { once: true })
  }

  async function playMusic() {
    const m = getMusic()
    if (!m || musicVolume.value === 0) return
    m.volume = toGain(musicVolume.value)
    try {
      await m.play()
    }
    catch {
      retryOnInteraction()
    }
  }

  function pauseMusic() {
    music?.pause()
  }

  function toggleMusic() {
    if (isMusicPlaying.value) pauseMusic()
    else playMusic()
  }

  function restartMusic() {
    const m = getMusic()
    if (!m) return
    m.currentTime = 0
    playMusic()
  }

  function muteMusic() {
    musicVolume.value = isMusicMuted.value ? lastMusicVolume.value : 0
  }

  // --- Bruitages -------------------------------------------------------------

  function getSound(name: SoundName) {
    let base = soundCache.get(name)
    if (!base) {
      base = new Audio(SOUNDS[name].src)
      base.preload = 'auto'
      soundCache.set(name, base)
    }
    return base
  }

  function playSound(name: SoundName) {
    if (!import.meta.client || soundVolume.value === 0) return
    const audio = getSound(name).cloneNode() as HTMLAudioElement
    audio.volume = toGain(soundVolume.value) * SOUNDS[name].volume
    audio.play().catch(() => {
    })
  }

  function preloadSounds() {
    if (!import.meta.client) return
    ;(Object.keys(SOUNDS) as SoundName[]).forEach(getSound)
  }

  function muteSounds() {
    soundVolume.value = isSoundMuted.value ? lastSoundVolume.value : 0
  }

  if (import.meta.client && !initialized) {
    initialized = true
    effectScope(true).run(() => {
      watch(soundVolume, (v) => {
        soundCookie.value = v
        if (v > 0) lastSoundVolume.value = v
      })

      watch(musicVolume, (v, old) => {
        musicCookie.value = v
        if (v > 0) lastMusicVolume.value = v
        if (music) music.volume = toGain(v)
        if (v === 0) pauseMusic()
        else if (old === 0 || !isMusicPlaying.value) playMusic()
      })
    })
  }

  return {
    // état
    soundVolume,
    musicVolume,
    isMusicPlaying: readonly(isMusicPlaying),
    isSoundMuted,
    isMusicMuted,

    // musique
    playMusic,
    pauseMusic,
    toggleMusic,
    restartMusic,
    muteMusic,

    // bruitages
    playSound,
    preloadSounds,
    muteSounds
  }
}
