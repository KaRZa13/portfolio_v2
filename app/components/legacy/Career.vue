<template>
  <section class="flex h-auto min-h-screen w-full flex-col items-center justify-center py-32">

    <LegacyBaseTextScrollTitle :text="t('globals.titles.career.main')" :text-class="'text-3xl md:text-5xl text-center whitespace-wrap'" :tag="'h2'" class="pb-32" />

    <main ref="cardsRef" class="flex h-auto w-4/5 flex-col items-stretch gap-16 md:flex-row lg:w-3/4">
      <!-- Pro -->
      <article 
        class="career-card group relative flex-1"
        @mouseenter="playSound('focusIn')"
        @mouseleave="playSound('focusOut')"
      >
        <span class="absolute inset-0 border-2 border-dashed border-black dark:border-slate-300" />

        <div class="relative flex h-full w-full flex-col border-2 border-black bg-purple-300 text-black transition-transform duration-300 group-hover:scale-105 dark:border-slate-300 dark:bg-purple-950 dark:text-slate-300">
          <h3 class="border-b-2 border-black p-4 text-xl font-medium sm:p-6 sm:text-2xl lg:px-8 dark:border-slate-300">
            {{ t('globals.titles.career.experience') }}
          </h3>

          <ul class="flex flex-col">
            <li
              v-for="pro in career.career"
              :key="pro.id"
              class="flex gap-4 border-b-2 border-black p-4 last:border-b-0 sm:p-6 lg:px-8 dark:border-slate-300"
            >
              <NuxtImg :src="pro.logo" :alt="pro.company" loading="lazy" class="h-16 w-16 shrink-0 rounded-lg object-contain p-1" />

              <div class="flex flex-1 flex-col gap-2">
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 class="text-lg font-medium sm:text-xl">{{ proText(pro.id, 'name') }}</h4>
                  <span class="rounded-full border px-3 py-0.5 text-sm bg-purple-400 dark:bg-violet-900 text-slate-900 dark:text-slate-300">{{ proText(pro.id, 'type') }}</span>
                </div>
                <p class="text-sm sm:text-base">{{ pro.company }} · {{ pro.location }}</p>
                <p class="text-sm opacity-80">{{ proText(pro.id, 'date') }}</p>
                <p class="text-sm sm:text-base">{{ proText(pro.id, 'description') }}</p>

                <ul class="flex flex-wrap gap-2 pt-2">
                  <li
                    v-for="skill in pro.skills"
                    :key="skill"
                    class="rounded-full border bg-violet-500/40 px-3 py-0.5 text-sm whitespace-nowrap"
                  >
                    {{ skill }}
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </article>

      <!-- Education -->
      <article 
        class="career-card group relative flex-1"
        @mouseenter="playSound('focusIn')"
        @mouseleave="playSound('focusOut')"
      >
        <span class="absolute inset-0 border-2 border-dashed border-black dark:border-slate-300" />

        <div class="relative flex h-full w-full flex-col border-2 border-black bg-purple-300 text-black transition-transform duration-300 group-hover:scale-105 dark:border-slate-300 dark:bg-purple-950 dark:text-slate-300">
          <h3 class="border-b-2 border-black p-4 text-xl font-medium sm:p-6 sm:text-2xl lg:px-8 dark:border-slate-300">
            {{ t('globals.titles.career.education') }}
          </h3>

          <ul class="flex flex-col">
            <li
              v-for="educ in career.education"
              :key="educ.id"
              class="flex gap-4 border-b-2 border-black p-4 last:border-b-0 sm:p-6 lg:px-8 dark:border-slate-300"
            >
              <NuxtImg :src="educ.logo" :alt="educ.school" loading="lazy" class="h-16 w-16 shrink-0 rounded-lg object-contain p-1" />

              <div class="flex flex-1 flex-col gap-2">
                <h4 class="text-lg font-medium sm:text-xl">{{ educationText(educ.id, 'name') }}</h4>
                <p class="text-sm sm:text-base">{{ educ.school }} · {{ educ.location }}</p>
                <p class="text-sm opacity-80">{{ educationText(educ.id, 'date') }}</p>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </main>
  </section>
</template>

<script setup lang="ts">
import career from '@/assets/globals/career.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const { playSound } = useSounds()

const proText = (id: string, field: 'type' | 'name' | 'date' | 'description') =>
  t(`globals.career.career.${id}.${field}`)
const educationText = (id: string, field: 'name' | 'date') =>
  t(`globals.career.education.${id}.${field}`)

const cardsRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(async () => {
  await nextTick()
  if (!cardsRef.value) return

  ctx = gsap.context(() => {
    gsap.fromTo('.career-card', {
      opacity: 0,
      y: 100,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.3,
      scrollTrigger: {
        trigger: cardsRef.value,
        start: 'top 70%',
        end: 'bottom 95%',
        scrub: true,
        toggleActions: 'play none none reverse',
        // markers: true
      },
    })
  }, cardsRef.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>
