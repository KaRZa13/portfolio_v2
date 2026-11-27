/**
 * Gestion globale de l'audio : bruitages (SFX) et musique de fond,
 * avec un volume indépendant pour chacun (0 → 100, persisté en cookie).
 *
 * Usage :
 *   const { soundVolume, musicVolume, playSound, restartMusic } = useSounds()
 *   playSound('hover')
 */

const SOUNDS = {
  hover: '/sounds/legacy/hover_sound.aac',
  focusIn: '/sounds/legacy/focus-in.aac',
  focusOut: '/sounds/legacy/focus-out.aac',
} as const

export type SoundName = keyof typeof SOUNDS

const MUSIC_SRC = '/musics/legacy/moments_like_this.aac'

const DEFAULT_SOUND_VOLUME = 0
const DEFAULT_MUSIC_VOLUME = 0
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 an

// --- Singletons côté client (les éléments Audio ne sont pas sérialisables) ---
let music: HTMLAudioElement | null = null
const soundCache = new Map<SoundName, HTMLAudioElement>()
let initialized = false
let waitingForInteraction = false

/** Courbe perceptuelle : un slider à 50 sonne "à moitié" plutôt que quasi plein. */
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

  // État partagé entre tous les composants (et SSR-safe grâce au cookie)
  const soundVolume = useState<number>('sound-volume', () => Number(soundCookie.value) || 0)
  const musicVolume = useState<number>('music-volume', () => Number(musicCookie.value) || 0)
  const isMusicPlaying = useState<boolean>('music-playing', () => false)

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

  /** Les navigateurs bloquent l'autoplay : on relance au premier clic / touche. */
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

  // --- Bruitages -------------------------------------------------------------

  function getSound(name: SoundName) {
    let base = soundCache.get(name)
    if (!base) {
      base = new Audio(SOUNDS[name])
      base.preload = 'auto'
      soundCache.set(name, base)
    }
    return base
  }

  /** Joue un bruitage. Clone l'élément pour permettre les lectures superposées (ex: hover rapide). */
  function playSound(name: SoundName) {
    if (!import.meta.client || soundVolume.value === 0) return
    const audio = getSound(name).cloneNode() as HTMLAudioElement
    audio.volume = toGain(soundVolume.value)
    audio.play().catch(() => {
      // Ignoré : bloqué tant que l'utilisateur n'a pas interagi avec la page
    })
  }

  /** Précharge tous les bruitages (à appeler au montage si besoin). */
  function preloadSounds() {
    if (!import.meta.client) return
    ;(Object.keys(SOUNDS) as SoundName[]).forEach(getSound)
  }

  // --- Watchers globaux (une seule fois, détachés du composant appelant) ----

  if (import.meta.client && !initialized) {
    initialized = true
    effectScope(true).run(() => {
      watch(soundVolume, (v) => {
        soundCookie.value = v
      })

      watch(musicVolume, (v, old) => {
        musicCookie.value = v
        if (music) music.volume = toGain(v)
        // Le slider pilote la lecture : 0 = pause, remonter depuis 0 = lecture
        if (v === 0) pauseMusic()
        else if (old === 0 || !isMusicPlaying.value) playMusic()
      })
    })

    // Volume musique déjà réglé (cookie) → on tente de lancer la musique
    if (musicVolume.value > 0) playMusic()
  }

  return {
    // état
    soundVolume,
    musicVolume,
    isMusicPlaying: readonly(isMusicPlaying),
    // musique
    playMusic,
    pauseMusic,
    toggleMusic,
    restartMusic,
    // bruitages
    playSound,
    preloadSounds,
  }
}
