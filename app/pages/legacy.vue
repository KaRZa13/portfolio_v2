<template>
  <div class="legacy w-full h-auto">
    <LegacyBackground
      :color="isDark ? [0.25, 0.25, 0.25] : [1, 1, 1]"
      :speed="0.5"
      :amplitude="0.2"
    />

    <LegacyBaseSettings />

    <section id="wrapper">
      <main id="content" class="flex flex-col">
        <LegacyHome />
        <LegacyProfile />
        <LegacySkills />
        <LegacyProjects />
        <LegacyCareer />
        <LegacyContact />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

onMounted(() => {
  ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: 1,
  });
});
</script>

<style scoped>
* {
  font-family: "Space Grotesk";
}
</style>