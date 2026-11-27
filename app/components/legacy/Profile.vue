<template>
  <!-- Desktop -->
  <section class="w-full h-auto flex flex-col justify-center items-center">

    <LegacyBaseTextScrollTitle :text="t('legacy.titles.profile')" :text-class="'text-5xl'" :tag="'h2'" class="pb-32"/>

    <div class="h-screen flex items-center justify-center">  
      <main ref="profilRef" class="w-3/4 h-auto flex items-stretch overflow-hidden border-2 border-black bg-purple-300/50 text-black dark:border-slate-300 dark:bg-purple-950 dark:text-slate-300">
        <div class="w-1/4 shrink-0 border-r-2 border-black dark:border-slate-300">
          <NuxtImg src="img/pp.webp" alt="Photo de profil" class="h-full w-full object-cover" />
        </div>
        <div class="w-3/4 flex items-center justify-center p-8 lg:p-16">
          <p class="text-xl font-light leading-10 text-justify">{{ t('legacy.profile.presentation') }}</p>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const profilRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (!profilRef.value) return
  gsap.fromTo(profilRef.value, {
    opacity: 0,
    y: 100,
  }, {
    opacity: 1,
    y: 0,
    duration: 1.5,
    scrollTrigger: {
      trigger: profilRef.value,
      start: 'top 60%',
      end: 'bottom 95%',
      scrub: true,
      toggleActions: 'play none none reverse',
      // markers: true
    }
  })
})
</script>