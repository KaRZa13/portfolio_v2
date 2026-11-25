<template>
  <section class="flex flex-col w-full h-auto justify-center items-center pt-32 gap-128">
    <LegacyTextScrollTitle :text="'Mes compétences'" :tag="'h2'" :text-class="'text-3xl md:text-5xl'" />

    <main class="h-auto w-4/5 md:w-2/3 lg:w-3/4 px-4 py-8">
      <div ref="gallery" class="flex flex-wrap justify-center items-center gap-4">
        <LegacyCardsTilted v-for="(skill, index) in skills" :key="index" :icon="skill.icon" :icon-alt="skill.alt" :title="skill.title" />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import skills from '@/assets/legacy/skills.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const gallery = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (!gallery.value) return

  gsap.fromTo(gallery.value, {
    opacity: 0,
    y: 100
  }, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: gallery.value,
      start: 'top 70%',
      end: 'bottom 85%',
      scrub: true,
      toggleActions: 'play none none reverse',
      markers: true
    }
  })
})
</script>