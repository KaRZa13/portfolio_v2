<template>
  <div class="legacy w-full h-auto">
    <LegacyBackground
      :color="isDark ? [0.25, 0.25, 0.25] : [1, 1, 1]"
      :speed="0.5"
      :amplitude="0.2"
    />

    <LegacyBaseSplashCursor />

    <LegacyBaseSettings />
    <LegacyBaseCookies v-model="soundEnabled" @save="onCookiesSave" />

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

const { soundVolume, musicVolume, playMusic, pauseMusic, preloadSounds } = useSounds();

const ENABLED_SOUND_VOLUME = 50;
const ENABLED_MUSIC_VOLUME = 30;

const soundEnabled = ref(soundVolume.value > 0 || musicVolume.value > 0);

function onCookiesSave(enabled: boolean) {
  if (!enabled) {
    soundVolume.value = 0;
    musicVolume.value = 0;
    pauseMusic();
    return;
  }

  if (soundVolume.value === 0) soundVolume.value = ENABLED_SOUND_VOLUME;
  if (musicVolume.value === 0) musicVolume.value = ENABLED_MUSIC_VOLUME;

  preloadSounds();
  playMusic();
}

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