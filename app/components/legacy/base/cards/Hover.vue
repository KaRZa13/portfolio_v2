<template>
  <article 
    class="group relative mx-auto block h-full w-[50vw] shrink-0"
    @mouseenter="playSound('focusIn')"
    @mouseleave="playSound('focusOut')"
  >
    <span class="absolute inset-0 border-2 border-dashed border-black dark:border-slate-300" />

    <div class="relative flex h-full w-full transform items-end overflow-hidden border-2 border-black bg-purple-300 text-black transition-transform group-hover:scale-105 dark:border-slate-300 dark:bg-purple-950 dark:text-slate-300">
      <!-- main -->
      <div class="absolute inset-0 flex flex-col transition-opacity duration-300 group-hover:opacity-0">
        <NuxtImg
          :src="props.imgSrc"
          :alt="props.imgAlt"
          loading="lazy"
          class="min-h-0 w-full flex-1 object-cover"
        />
        <h2 class="border-t-2 border-black p-4 text-xl font-medium sm:p-6 sm:text-2xl lg:px-8 dark:border-slate-300">
          {{ props.name }}
        </h2>
      </div>

      <!-- hover -->
      <div class="absolute inset-0 flex flex-col gap-8 overflow-y-auto p-4 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto sm:p-6 lg:p-8">
        <h3 class="text-xl font-medium sm:text-2xl">
          {{ props.name }}
        </h3>

        <p class="text-sm whitespace-pre-line sm:text-base">
          {{ props.description }}
        </p>

        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tech in props.techs"
            :key="tech"
            class="rounded-full border bg-violet-500/40 px-4 py-1 whitespace-nowrap"
          >
            {{ tech }}
          </li>
        </ul>

        <a
          :href="props.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group/link relative mt-auto self-start text-lg leading-8 no-underline"
        >
          {{ props.urlLabel }}
          <span class="absolute right-0 -bottom-1 h-0.5 w-0 rounded bg-current transition-all duration-400 group-hover/link:left-0 group-hover/link:w-full" />
        </a>
      </div>
    </div>
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

const { playSound } = useSounds()
</script>
