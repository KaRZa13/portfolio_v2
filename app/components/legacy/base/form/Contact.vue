<template>
  <UForm class="w-3/4 flex flex-col gap-8">
    <section class="w-full flex gap-8">
      <UInput 
        class="w-1/2"
        :placeholder="t('globals.contact.formfields.lastname')"
        size="xl"
      />
      <UInput 
        class="w-1/2"
        :placeholder="t('globals.contact.formfields.firstname')"
        size="xl"
      />
    </section>
    <UInput 
      :placeholder="t('globals.contact.formfields.email')"
      size="xl"
    />
    <UInput 
      :placeholder="t('globals.contact.formfields.subject')"
      size="xl"
    />
    <UInput 
      :placeholder="t('globals.contact.formfields.message')"
      size="xl"
    />
    <UButton 
      :label="t('globals.contact.formfields.submit')"
      size="xl"
      class="cursor-pointer"
    />
  </UForm>
</template>

<script setup lang="ts">
// import * as zod from 'zod'

const { t } = useI18n()
</script>