<template>
  <component :is="tag" :class="containerClass" :aria-label="text">
    <span
      v-for="(char, i) in displayed"
      :key="i"
      aria-hidden="true"
      :class="revealed[i] ? textClass : encryptedClass"
    >{{ char }}</span>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  tag?: string
  characters?: string
  textClass?: string
  encryptedClass?: string
  containerClass?: string
  maxIterations?: number
  speed?: number
  sequential?: boolean
}>(), {
  tag: 'p',
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}<>?/|',
  textClass: '',
  encryptedClass: 'opacity-60',
  containerClass: 'inline-block whitespace-pre-wrap',
  maxIterations: 10,
  speed: 50,
  sequential: false,
})

const displayed = ref<string[]>([...props.text])
const revealed = ref<boolean[]>([...props.text].map(() => true))

let timer: ReturnType<typeof setInterval> | null = null

const randomChar = () => props.characters[Math.floor(Math.random() * props.characters.length)] ?? ''
const isBlank = (c: string) => /\s/.test(c)

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}

function start() {
  stop()
  const target = [...props.text]

  if (!props.characters.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayed.value = target
    revealed.value = target.map(() => true)
    return
  }

  revealed.value = target.map(isBlank)
  const revealAt = target.map(() => 1 + Math.floor(Math.random() * Math.max(1, props.maxIterations)))
  let iteration = 0
  let cursor = 0

  const tick = () => {
    iteration++

    if (props.sequential) {
      while (cursor < target.length && revealed.value[cursor]) cursor++
      if (cursor < target.length) revealed.value[cursor] = true
    } else {
      target.forEach((_, i) => {
        if (iteration >= revealAt[i]!) revealed.value[i] = true
      })
    }
    
    displayed.value = target.map((c, i) => (revealed.value[i] ? c : randomChar()))

    if (revealed.value.every(Boolean)) stop()
  }

  displayed.value = target.map((c, i) => (revealed.value[i] ? c : randomChar()))
  timer = setInterval(tick, props.speed)
}

onMounted(start)
watch(() => [props.text, props.sequential, props.maxIterations, props.speed, props.characters], start)
onBeforeUnmount(stop)

defineExpose({ start })
</script>
