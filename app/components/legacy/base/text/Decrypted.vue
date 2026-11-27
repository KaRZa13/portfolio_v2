<template>
  <span
    ref="containerRef"
    class="decrypted-text"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <span class="decrypted-text__sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <span
        v-for="(char, index) in chars"
        :key="index"
        :class="isRevealedOrDone(index) ? charClass : encryptedClass"
      >{{ char }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
type RevealDirection = 'start' | 'end' | 'center'
type AnimateOn = 'hover' | 'view'
 
const props = withDefaults(
  defineProps<{
    text: string
    speed?: number
    maxIterations?: number
    sequential?: boolean
    revealDirection?: RevealDirection
    useOriginalCharsOnly?: boolean
    characters?: string
    /** Classe appliquée aux caractères révélés / au repos */
    charClass?: string
    /** Classe appliquée aux caractères encore brouillés */
    encryptedClass?: string
    animateOn?: AnimateOn
  }>(),
  {
    speed: 50,
    maxIterations: 10,
    sequential: false,
    revealDirection: 'start',
    useOriginalCharsOnly: false,
    characters:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    charClass: '',
    encryptedClass: '',
    animateOn: 'hover',
  },
)
 
const containerRef = ref<HTMLElement | null>(null)
const displayText = ref(props.text)
const isHovering = ref(false)
const isScrambling = ref(false)
const revealedIndices = ref<Set<number>>(new Set())
 
let interval: ReturnType<typeof setInterval> | null = null
let observer: IntersectionObserver | null = null
 
const chars = computed(() => displayText.value.split(''))
 
const availableChars = computed(() =>
  props.useOriginalCharsOnly
    ? Array.from(new Set(props.text.split(''))).filter((c) => c !== ' ')
    : props.characters.split(''),
)
 
function getNextIndex(revealed: Set<number>): number {
  const len = props.text.length
  switch (props.revealDirection) {
    case 'end':
      return len - 1 - revealed.size
    case 'center': {
      const middle = Math.floor(len / 2)
      const offset = Math.floor(revealed.size / 2)
      const next =
        revealed.size % 2 === 0 ? middle + offset : middle - offset - 1
      if (next >= 0 && next < len && !revealed.has(next)) return next
      for (let i = 0; i < len; i++) if (!revealed.has(i)) return i
      return 0
    }
    case 'start':
    default:
      return revealed.size
  }
}
 
function shuffleText(original: string, revealed: Set<number>): string {
  if (props.useOriginalCharsOnly) {
    const positions = original.split('').map((char, i) => ({
      char,
      isSpace: char === ' ',
      isRevealed: revealed.has(i),
    }))
 
    const pool = positions
      .filter((p) => !p.isSpace && !p.isRevealed)
      .map((p) => p.char)
 
    // Mélange de Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]]
    }
 
    let k = 0
    return positions
      .map((p) => (p.isSpace ? ' ' : p.isRevealed ? p.char : pool[k++]))
      .join('')
  }
 
  const pool = availableChars.value
  return original
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (revealed.has(i)) return char
      return pool[Math.floor(Math.random() * pool.length)]
    })
    .join('')
}
 
function stopInterval() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}
 
function startScramble() {
  stopInterval()
  isScrambling.value = true
  let iteration = 0
 
  interval = setInterval(() => {
    if (props.sequential) {
      const current = revealedIndices.value
      if (current.size < props.text.length) {
        const next = new Set(current)
        next.add(getNextIndex(current))
        revealedIndices.value = next
        displayText.value = shuffleText(props.text, next)
      } else {
        stopInterval()
        isScrambling.value = false
      }
    } else {
      displayText.value = shuffleText(props.text, revealedIndices.value)
      iteration++
      if (iteration >= props.maxIterations) {
        stopInterval()
        isScrambling.value = false
        displayText.value = props.text
      }
    }
  }, props.speed)
}
 
function reset() {
  stopInterval()
  displayText.value = props.text
  revealedIndices.value = new Set()
  isScrambling.value = false
}
 
watch(
  [
    isHovering,
    () => props.text,
    () => props.speed,
    () => props.maxIterations,
    () => props.sequential,
    () => props.revealDirection,
    () => props.characters,
    () => props.useOriginalCharsOnly,
  ],
  () => (isHovering.value ? startScramble() : reset()),
)
 
function isRevealedOrDone(index: number) {
  return (
    revealedIndices.value.has(index) || !isScrambling.value || !isHovering.value
  )
}
 
function onMouseEnter() {
  if (props.animateOn === 'hover') isHovering.value = true
}
function onMouseLeave() {
  if (props.animateOn === 'hover') isHovering.value = false
}
 
// IntersectionObserver uniquement côté client (compatible SSR)
onMounted(() => {
  if (props.animateOn !== 'view' || !containerRef.value) return
 
  // Entrée dans l'écran → lance l'effet ; sortie → reset, pour le rejouer au prochain passage
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) isHovering.value = entry.isIntersecting
    },
    { root: null, rootMargin: '0px', threshold: 0.1 },
  )
  observer.observe(containerRef.value)
})
 
onBeforeUnmount(() => {
  stopInterval()
  observer?.disconnect()
})
</script>
 
<style scoped>
.decrypted-text {
  display: inline-block;
  white-space: pre-wrap;
}
 
.decrypted-text__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>