<template>
  <article class="w-[50vw] h-[50vh]">
    <!-- Face avant -->
    <div>
      <NuxtImg :src="props.imgSrc" :alt="props.imgAlt" />
      <span />
      <h3 class="">{{ props.name }}</h3>
    </div>
    <!-- Face arrière -->
    
  </article>
</template>

<script setup lang="ts">
interface Props {
  name: string
  description: string
  techs: string[]
  url: string
  urlLabel: string
  imgSrc: string
  imgAlt: string
}
const props = defineProps<Props>()
</script>