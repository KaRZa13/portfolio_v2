<template>
  <div
    class="fixed top-0 right-0 z-50 p-4"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div ref="reveal">
      <div
        ref="settings-panel"
        class="bg-purple-300 dark:bg-purple-950 flex flex-col rounded-3xl corner-squircle p-2"
        :class="isSettingsOpen ? 'min-w-xs max-w-md' : ''"
      >
        <div class="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300 italic font-bold text-lg">
          <h3 v-show="isSettingsOpen" class="pl-2">{{ t('legacy.settings.title') }}</h3>
          <UButton
            :icon="isSettingsOpen ? 'i-lucide-x' : 'i-lucide-settings'"
            class="cursor-pointer"
            variant="ghost"
            color="neutral"
            :ui="{ base: 'dark:hover:bg-purple-900 hover:bg-purple-400 dark:active:bg-purple-900 active:bg-purple-400 rounded-full p-2' }"
            @click="toggleSettings"
          />
        </div>

        <main v-show="isSettingsOpen" ref="settings" class="flex flex-col gap-1 py-2">
          <!-- Color Mode -->
          <div class="flex items-center gap-2 p-2">
            <p class="w-full flex-1 pl-2">{{ t('legacy.settings.color_mode') }}</p>
            <UColorModeSelect
              :ui="{
                base: 'bg-purple-200 dark:bg-purple-950',
                content: 'bg-purple-300 dark:bg-purple-950',
                item: 'data-highlighted:before:bg-purple-200 dark:data-highlighted:before:bg-purple-900',
              }"
            />
          </div>
  
          <USeparator class="px-4" :ui="{ border: 'border-violet-500' }" />

          <!-- Sounds -->
          <div class="flex items-center gap-2 p-2">
            <p class="w-full flex-1 pl-2">{{ t('legacy.settings.sounds') }}</p>
            <div class="w-2/3 flex items-center gap-1.5">
              <UIcon :name="soundIcon" class="size-6" />
              <USlider
                v-model="soundVolume"
                :ui="{
                  range: 'bg-purple-500 dark:bg-purple-600',
                  thumb:
                    'ring-purple-500 dark:ring-purple-600 outline-purple-500/25 dark:outline-purple-600/25',
                  track: 'bg-purple-100 dark:bg-purple-200',
                }"
              />
              <p>{{soundVolume}}</p>
            </div>
          </div>
  
          <USeparator class="px-4" :ui="{ border: 'border-violet-500' }" />

          <!-- Music -->
          <div class="flex items-center gap-2 p-2">
            <p class="w-full flex-1 pl-2">{{ t('legacy.settings.music') }}</p>
            <div class="w-2/3 flex items-center gap-1.5">
              <UIcon :name="musicIcon" class="size-6" />
              <USlider
                v-model="musicVolume"
                :ui="{
                  range: 'bg-purple-500 dark:bg-purple-600',
                  thumb:
                    'ring-purple-500 dark:ring-purple-600 outline-purple-500/25 dark:outline-purple-600/25',
                  track: 'bg-purple-100 dark:bg-purple-200',
                }"
              />
              <p>{{musicVolume}}</p>
            </div>
          </div>

          <USeparator class="px-4" :ui="{ border: 'border-violet-500' }" />

          <!-- Languages -->
          <div class="flex items-center gap-2 p-2">
            <p class="w-full flex-1 pl-2">{{ t('legacy.settings.language') }}</p>
            <ULocaleSelect 
              size="md"
              :model-value="locale" 
              :locales="[en, fr]" 
              @update:model-value="changeLocale" 
            />
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { en, fr } from '@nuxt/ui/locale'

gsap.registerPlugin(Flip, ScrollTrigger)

const { t, locale, setLocale } = useI18n()
const isSettingsOpen = ref(true)
// const isSoundPlaying = ref(false)
// const isMusicPlaying = ref(false)

const musicIcon = computed(() => getVolumeIcon(musicVolume.value))
const musicVolume = ref(0)
const soundIcon = computed(() => getVolumeIcon(soundVolume.value))
const soundVolume = ref(0)

const settingsPanel = useTemplateRef<HTMLElement>('settings-panel')
const settings = useTemplateRef<HTMLElement>('settings')
let flipTween: gsap.core.Timeline | null = null

const reveal = useTemplateRef<HTMLElement>('reveal')
const isScrolled = ref(false)
const isHovered = ref(false)

const isVisible = computed(() => !isScrolled.value || isHovered.value || isSettingsOpen.value)

let scrollTrigger: ScrollTrigger | null = null

onMounted(() => {
  scrollTrigger = ScrollTrigger.create({
    start: 50,
    end: 'max',
    onEnter: () => (isScrolled.value = true),
    onLeaveBack: () => (isScrolled.value = false),
  })
})

onBeforeUnmount(() => scrollTrigger?.kill())

watch(isVisible, (visible) => {
  gsap.to(reveal.value, {
    autoAlpha: visible ? 1 : 0,
    y: visible ? 0 : -20,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: true,
  })
})

const toggleSettings = async () => {
  if (!settingsPanel.value || !settings.value) return
  const opening = !isSettingsOpen.value

  // Fermeture
  if (!opening) {
    await gsap.to(settings.value.children, {
      autoAlpha: 0, y: 0, duration: 0.15, stagger: 0.03,
    })
  }

  // 1. Enregistrer l'état actuel
  const state = Flip.getState(settingsPanel.value, { props: 'borderRadius,padding' })
  flipTween?.kill()

  // 2. Changer l'état
  isSettingsOpen.value = opening
  await nextTick()

  // 3. Animer de l'ancien état vers le nouveau
  flipTween = Flip.from(state, {
    duration: 0.5,
    ease: 'power2.out',
  })

  // Ouverture
  if (opening) {
    gsap.fromTo(
      settings.value.children,
      { autoAlpha: 0, y: 0 },
      { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.05, delay: 0.2 },
    )
  }
}

// const toggleSound = () => {
//   console.log("Sound toggled")
// }

// const toggleMusic = () => {
//   console.log("Music toggled")
// }

function getVolumeIcon(volume: number) {
  if (volume === 0) return 'i-lucide-volume-x'
  if (volume <= 33) return 'i-lucide-volume'
  if (volume <= 66) return 'i-lucide-volume-1'
  return 'i-lucide-volume-2'
}

function changeLocale(code: string) {
  setLocale(code as typeof locale.value)
}
</script>
