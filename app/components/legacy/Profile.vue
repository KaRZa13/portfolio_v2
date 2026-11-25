<template>
  <!-- Desktop -->
  <section class="w-full h-auto flex flex-col justify-center items-center">

    <LegacyTextScrollTitle :text="'Une petite présentation s\'impose'" :text-class="'text-5xl'" :tag="'h2'" class="pb-32"/>

    <div class="h-screen flex items-center justify-center">  
      <main ref="profilRef" class="w-full h-auto bg-purple-200/50 flex items-center justify-center px-24 space-x-32 py-16">
        <div class="w-1/4 h-full flex items-center justify-center">
          <NuxtImg src="pp.png" alt="Photo de profil" class="rounded-full" />
        </div>
        <div class="w-3/4 h-full flex items-center justify-center">
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