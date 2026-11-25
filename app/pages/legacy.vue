<template>
  <div class="flex flex-col scroll-smooth">
    <LegacyBackground :color="[1, 1, 1]" :speed="0.5" :amplitude="0.2" />
    <LegacyHome />
    <LegacyProfile />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
* {
  font-family: "Space Grotesk";
}
</style>
