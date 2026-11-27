<template>
  <ClientOnly>
    <component :is="props.tag" ref="text" :class="`w-full h-fit text-center ${props.textClass}`">
      {{ props.text }}
    </component>
  </ClientOnly>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollTitleProps {
  tag?: keyof HTMLElementTagNameMap
  text: string
  textClass?: string
}

const props = withDefaults(defineProps<ScrollTitleProps>(), {
  tag: 'h1',
  textClass: '',
})

const text = ref<string>(props.text)

gsap.registerPlugin(SplitText, ScrollTrigger)

onMounted(async () => {  
  await nextTick()
  if (!text.value) return

  const split: SplitText | null = new SplitText(text.value, {
    type: 'chars, words',
    charsClass: `char`,
    wordsClass: `${props.textClass}`,
  })

  gsap.fromTo(split.chars,
    {
      x: 150,
      y: 100,
      opacity: 0,
    },
    {
      x: 0,
      y: 0,
      opacity: 1,
      ease: 'power1.in',
      stagger: 1,
      duration: 5,
      scrollTrigger: {
        trigger: text.value,
        start: 'top 80%',
        end: 'bottom 75%',
        scrub: true,
        // markers: true,
      }
    }
  )
})
</script>