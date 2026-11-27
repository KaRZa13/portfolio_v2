<template>
  <div ref="root" class="w-3/4">
    <UForm :schema="schema" :state="state" class="w-full flex flex-col gap-8" @submit="onSubmit">
      <section class="w-full flex gap-8">
        <UFormField class="w-1/2" name="lastname">
          <UInput
            v-model="state.lastname"
            :placeholder="t('globals.contact.formfields.lastname')"
            size="xl"
            :ui="fieldUi"
            />
        </UFormField>
        <UFormField class="w-1/2" name="firstname">
          <UInput
            v-model="state.firstname"
            :placeholder="t('globals.contact.formfields.firstname')"
            size="xl"
            :ui="fieldUi"
          />
        </UFormField>
      </section>
      <UFormField name="email" class="w-full">
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="t('globals.contact.formfields.email')"
          size="xl"
          :ui="fieldUi"
        />
      </UFormField>
      <UFormField name="subject" class="w-full">
        <UInput
          v-model="state.subject"
          :placeholder="t('globals.contact.formfields.subject')"
          size="xl"
          :ui="fieldUi"
        />
      </UFormField>
      <UFormField name="message" class="w-full">
        <UTextarea
          v-model="state.message"
          :placeholder="t('globals.contact.formfields.message')"
          size="xl"
          :rows="5"
          autoresize
          :ui="fieldUi"
        />
      </UFormField>
      <UButton
        :label="t('globals.contact.formfields.submit')"
        size="xl"
        block
        type="submit"
        class="cursor-pointer"
        :loading="loading"
        :ui="{
          base: 'rounded-lg border border-black dark:border-slate-300 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:active:bg-purple-800 text-white font-bold shadow-lg transition-colors',
        }"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  lastname: z.string().min(1),
  firstname: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  lastname: undefined,
  firstname: undefined,
  email: undefined,
  subject: undefined,
  message: undefined,
})

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const toast = useToast()
const config = useRuntimeConfig()
const loading = ref(false)

const root = useTemplateRef<HTMLElement>('root')
let ctx: gsap.Context | null = null

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    await emailjs.send(
      config.public.emailjsServiceId,
      config.public.emailjsTemplateId,
      event.data,
      { publicKey: config.public.emailjsPublicKey },
    )
    toast.add({ title: 'Message envoyé', color: 'success' })
  } catch {
    toast.add({ title: 'Erreur', description: "L'envoi a échoué", color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  const form = root.value?.querySelector('form')
  if (!root.value || !form) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = gsap.context(() => {
    // Les deux champs nom/prénom apparaissent séparément, puis les autres éléments du formulaire
    const items = Array.from(form.children).flatMap((el) =>
      el.tagName === 'SECTION' ? Array.from(el.children) : [el],
    )

    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: root.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())

const fieldUi = {
  root: 'w-full',
  base: [
    'rounded-lg shadow-lg',
    'bg-purple-200/50 dark:bg-purple-950/50',
    'text-black dark:text-slate-300',
    'placeholder:text-slate-600 dark:placeholder:text-slate-400',
    'ring ring-inset ring-black dark:ring-slate-300',
    'focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-600',
    'transition-shadow',
  ].join(' '),
}
</script>
