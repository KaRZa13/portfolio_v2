<template>
  <section class="relative w-screen h-screen flex justify-center">
    <!-- Title -->
    <div class="flex flex-col space-y-8 items-center justify-center">
      <LegacyBaseTextBlur :text="t('legacy.home.name')" :text-class="'text-9xl text-black dark:text-slate-300'" :tag="'h1'" />
      <LegacyBaseTextBlur :text="t('legacy.home.description')" :text-class="'text-5xl text-black dark:text-slate-300'" :duration="1.25" :tag="'h2'" />
    </div>

    <!-- Scroll Down -->
    <div ref="scrollDivRef" class='w-auto absolute bottom-20 flex justify-center items-center bg-white/50 dark:bg-white/10 rounded-full p-2 gap-2 whitespace-nowrap'>
      <UIcon name="i-lucide-arrow-down" class="size-8" />
      <p class="text-black dark:text-slate-300">{{ t('legacy.home.scroll') }}</p>
      <UIcon name="i-lucide-arrow-down" class="size-8 text-black dark:text-slate-300" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const scrollDivRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (!scrollDivRef.value) return
  
  gsap.fromTo(scrollDivRef.value, {
    width: scrollDivRef.value?.offsetWidth || 0,
    opacity: 1,
  }, {
    width: 0,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: scrollDivRef.value,
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: true,
      toggleActions: 'play none none reverse',
      // markers: true
    }
  })
})
</script>