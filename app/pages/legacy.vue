<template>
  <div class="w-full h-auto">
    <LegacyBackground :color="[1, 1, 1]" :speed="0.5" :amplitude="0.2" />
    <section id="wrapper">
      <main id="content" class="flex flex-col">
        <LegacyHome />
        <LegacyProfile />
        <LegacySkills />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from "gsap/ScrollSmoother"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

onMounted(() => {
  ScrollSmoother.create({
    wrapper: '#wrapper',
    content: '#content',
    smooth: 1,
  })
})
</script>

<style scoped>
* {
  font-family: "Space Grotesk";
}
</style>
