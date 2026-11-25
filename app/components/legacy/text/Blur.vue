<template>
  <component :is="props.tag" ref="text" :class="`w-auto h-auto ${props.textClass}`">
    {{ props.text }}
  </component>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

interface BlurtextProps {
  tag: keyof HTMLElementTagNameMap
  text: string
  textClass?: string
  duration?: number
  amount?: number
}

const props = withDefaults(defineProps<BlurtextProps>(), {
  amount: 0.15,
  duration: 1,
  textClass: '',
})

const text = ref<string>(props.text)

gsap.registerPlugin(SplitText)

onMounted(() => {
  const split: SplitText | null = SplitText.create(text.value, {
    type: 'words',
    wordsClass: `${props.textClass}`,
  })

  gsap.fromTo(split.words,
    {
      y: -50,
      autoAlpha: 0,
      filter: 'blur(10px)',
    },
    {
      y: 0,
      duration: props.duration,
      ease: 'power1.in',
      autoAlpha: 1,
      filter: 'blur(0px)',
      stagger: {
        amount: 0.15,
        from: 'start',
      },
    })
})
</script>