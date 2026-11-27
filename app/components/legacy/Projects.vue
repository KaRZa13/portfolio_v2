<template>
  <section class="h-auto w-full flex flex-col items-center mt-[25vh]">

    <LegacyBaseTextScrollTitle :text="t('legacy.titles.projects')" :tag="'h2'" :text-class="'text-5xl pb-32'"/>

    <div ref="projectsWrapper" class="h-screen w-full flex items-center md:overflow-hidden">
      <main ref="projectsList" class="w-auto h-1/2 flex flex-col items-center gap-16 md:w-max md:flex-row md:px-[25vw]">
        <LegacyBaseCardsHover
          v-for="project in projects"
          :key="project.id"
          :name="project.name ?? t(`legacy.projects.${project.id}.name`)"
          :description="t(`legacy.projects.${project.id}.description`)"
          :techs="project.techs"
          :url="project.url"
          :url-label="projectLinkLabel(project.id)"
          :img-src="project.image.src"
          :img-alt="project.image.alt"
        />
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import projects from '@/assets/legacy/projects.json'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const { t, te } = useI18n()

const projectLinkLabel = (id: string) => {
  const key = `legacy.projects.${id}.linkLabel`
  return te(key) ? t(key) : t('legacy.projects.linkLabel')
}
const projectsWrapper = ref<HTMLElement | null>(null)
const projectsList = ref<HTMLElement | null>(null)

let matchMedia: gsap.MatchMedia | null = null

onMounted(() => {
  matchMedia = gsap.matchMedia()

  matchMedia.add('(min-width: 768px)', () => {
    const wrapper = projectsWrapper.value
    const list = projectsList.value
    if (!wrapper || !list) return

    const distance = () => list.scrollWidth - window.innerWidth

    gsap.to(list, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
      },
    })
  })
})

onBeforeUnmount(() => matchMedia?.revert())
</script>
