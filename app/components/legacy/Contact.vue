<template>
  <section class="h-screen w-screen flex flex-col">
    <div class="w-full h-3/5 bg-zinc-500/80 dark:bg-transparent inline-flex justify-center items-center px-16">
      <aside class="w-full flex flex-col justify-center items-center">
        <LazyLegacyBaseTextDecrypted text="SSSSSSSSSSS" tag="h2"/>
      </aside>

      <USeparator orientation="vertical" class="h-2/3" color="neutral"/>
      
      <main class="w-full flex flex-col justify-center items-center px-32">
        <LegacyBaseFormContact />
      </main>
    </div>
    <footer class="w-full h-2/5 bg-purple-200/60 flex justify-center items-center gap-8 py-2">
      <!-- Icons -->
      <div v-for="(social, index) in socials" :key="index">
        <a :href="social.link" target="_blank" rel="nonreferrer">
          <button class="relative w-24 h-24 rounded-full group cursor-pointer">
            <div :class="social.bg_color" class="floater w-full h-full absolute top-0 left-0 rounded-full duration-300 group-hover:-top-18 group-hover:shadow-2xl" />
            <div :class="[social.border_color, social.text_color]" class="icon relative z-10 w-full h-full flex items-center justify-center border-2 rounded-full">
              <UIcon :name="social.icon" class="size-12" />
            </div>
            
          </button>
        </a>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import socials from '@/assets/globals/socials.json';
</script>
