<template>
  <section class="h-auto w-auto flex flex-col mt-[25vh]">
    <LegacyTextScrollTitle :text="'Mes réalisations'" :tag="'h2'" :text-class="'text-3xl'" />
    <div ref="projectsWrapper" class="h-screen w-auto flex items-center">
      <main ref="projects" class="w-auto h-full flex flex-col md:flex-row md:gap-6">
        <LegacyCardsFlip 
          v-for="(project, index) in projects" 
          :ref="(el) => setElementRef(el, index)" 
          :key="index"
          :name="project.name"
          :description="project.description"
          :techs="project.techs"
          :url="project.url.url"
          :url-label="project.url.label"
          :img-src="project.image.src"
          :img-alt="project.image.alt"
        />
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import projects from '@/assets/legacy/projects.json'
import { gsap } from 'gsap'

const galleryElement = ref<HTMLElement[]>([])

function setElementRef(el: HTMLElement, index: number): void {
  if (el) {
    galleryElement.value[index] = el
  }

}

onMounted(() => {
  nextTick(() => {
    // Identifier les éléments de la galerie
    const firstElement: any = galleryElement.value[0]
    const lastElement: any = galleryElement.value[galleryElement.value.length - 1]

    // Calculer les décalages pour centrer les éléments
    const rightShiftFirstElement: number = firstElement.$el.offsetLeft + firstElement.$el.offsetWidth / 2 - window.innerWidth / 2
    const leftShiftLastElement: number = lastElement.$el.offsetLeft + lastElement.$el.offsetWidth / 2 - window.innerWidth / 2

    // Centrer le premier élément
    if (firstElement && projects.value) {
      gsap.set(projects.value, {
        x: -rightShiftFirstElement
      })
    }

    // Scroll horizontal
    gsap.to(projects.value, {
      x: `-${leftShiftLastElement}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: projects.value,
        start: 'center center',
        end: `${projects.value?.scrollWidth ? projects.value.scrollWidth - window.innerWidth : 0}`,
        scrub: true,
        pin: true,
        markers: true,
      }
    })
  })
})

</script>