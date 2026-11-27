<template>
  <UModal
    v-model:open="open"
    title="Cookies"
    :description="t('legacy.cookies.description')"
    :dismissible="false"
    :close="false"
    :ui="{
      overlay: 'bg-black/60',
      content: 'max-w-xl rounded-none shadow-none ring-0 border-2 border-black bg-purple-300 text-black divide-y-2 divide-black dark:border-slate-300 dark:bg-purple-950 dark:text-slate-300 dark:divide-slate-300',
      header: 'p-4 sm:p-6 lg:px-8',
      title: 'text-xl font-medium text-inherit sm:text-2xl',
      description: 'sr-only',
      body: 'p-0 sm:p-0',
    }"
  >
    <template #body>
      <!-- body -->
      <div class="flex flex-col gap-4 p-4 sm:p-6 lg:px-8 dark:border-slate-300">
        <p class="text-sm sm:text-base">
          {{ t('legacy.cookies.title') }}
        </p>
        <span class="self-start rounded-full border bg-violet-500/40 px-3 py-0.5 text-sm">
          {{ t('legacy.cookies.description') }}
        </span>
      </div>

      <!-- footer -->
      <div class="flex flex-col gap-4 p-4 sm:p-6 lg:px-8">
        <div class="flex items-center justify-between gap-4">
          <p class="text-sm font-medium sm:text-base">
            {{ t('legacy.cookies.choice') }}
          </p>
          <USwitch
            v-model="soundEnabled"
            checked-icon="i-lucide-check"
            unchecked-icon="i-lucide-x"
            size="lg"
            :ui="{
              base: 'border-2 border-black dark:border-slate-300 data-[state=checked]:bg-purple-500 dark:data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200 dark:data-[state=unchecked]:bg-violet-900 cursor-pointer',
              thumb: 'bg-white dark:bg-slate-300',
              icon: 'group-data-[state=checked]:text-purple-600',
            }"
          />
        </div>

        <UButton
          :label="t('legacy.cookies.save')"
          size="xl"
          block
          class="cursor-pointer"
          :ui="{
            base: 'rounded-none border-2 border-black dark:border-slate-300 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:active:bg-purple-800 text-white font-bold transition-colors',
          }"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()

const soundEnabled = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  save: [soundEnabled: boolean]
}>()

const open = useState<boolean>('cookies-modal-open', () => true)

function save() {
  emit('save', soundEnabled.value)
  open.value = false
}
</script>
