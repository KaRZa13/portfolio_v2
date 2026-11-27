<template>
  <article 
    ref="cardRef" 
    class="md:h-50 lg:h-42 h-36 flex flex-col bg-purple-200/50 dark:bg-purple-950/50 items-center justify-around rounded-lg border border-black shadow-lg aspect-square
    before:w-8 before:h-8 before:border before:border-gray-600 before:absolute before:z-10 before:opacity-30 before:duration-500 before:top-7 before:right-7
    lg:before:top-6 lg:before:right-6 md:before:top-8 md:before:right-8 before:border-b-0 before:border-l-0 
    hover:before:w-[calc(100%-2rem)] hover:before:h-[calc(100%-2rem)] hover:after:w-[calc(100%-2rem)] hover:after:h-[calc(100%-2rem)]
    lg:hover:before:w-[calc(100%-3rem)] lg:hover:before:h-[calc(100%-3rem)] lg:hover:after:w-[calc(100%-3rem)] lg:hover:after:h-[calc(100%-3rem)]
    md:hover:before:w-[calc(100%-4rem)] md:hover:before:h-[calc(100%-4rem)] md:hover:after:w-[calc(100%-4rem)] md:hover:after:h-[calc(100%-4rem)]
    after:w-8 after:h-8 after:border after:border-gray-600 after:absolute after:z-10 after:opacity-30 after:duration-500 after:bottom-7 after:left-7 
    lg:after:bottom-6 lg:after:left-6 md:after:bottom-8 md:after:left-8 after:border-t-0 after:border-r-0"
    style="transform-style: preserve-3d;"
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <main class="h-full flex flex-col">
      <div class="flex-1 p-10 lg:p-10 md:p-12">
        <UIcon :name="icon" :alt="iconAlt " class="size-18"/>
      </div>
      <div class="absolute bottom-1 lg:bottom-px left-1/2 transform -translate-x-1/2 text-center w-full">
        <h3 class="text-xl lg:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">{{ title }}</h3>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  iconAlt: string
  title: string
  maxTilt?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxTilt: 15
})

const cardRef = ref<HTMLElement>()
const mouseX = ref<number>(0)
const mouseY = ref<number>(0)
const isHovered = ref<boolean>(false)

const cardStyle = computed(() => {
  if (!isHovered.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.3s ease-out'
    }
  }

  const rotateX = (mouseY.value - 0.5) * props.maxTilt
  const rotateY = (mouseX.value - 0.5) * -props.maxTilt

  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
    transition: 'transform 0.1s ease-out'
  }
})

const handleMouseMove = (event: MouseEvent) => {
  if (!cardRef.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  mouseX.value = (event.clientX - centerX) / (rect.width / 2)
  mouseY.value = (event.clientY - centerY) / (rect.height / 2)
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  mouseX.value = 0
  mouseY.value = 0
}
</script>