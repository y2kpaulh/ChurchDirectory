<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="$emit('close')">
    <form
      class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4"
      @submit.prevent="submit"
    >
      <h3 class="text-lg font-bold text-gray-900">
        {{ editing ? '카테고리 수정' : '카테고리 추가' }}
      </h3>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">업종 이름 *</span>
        <input
          v-model="name"
          required
          maxlength="50"
          placeholder="예: IT/기술"
          class="mt-1 w-full p-2.5 border rounded-lg"
        >
      </label>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="px-4 py-2 rounded-lg border hover:bg-gray-50" @click="$emit('close')">
          취소
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {{ saving ? '저장 중...' : '저장' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  editing: boolean
  initialName: string
}>()

const emit = defineEmits<{
  close: []
  save: [name: string]
}>()

const name = ref(props.initialName)
const saving = ref(false)
const errorMessage = ref('')

watch(() => props.initialName, (v) => {
  name.value = v
})

function submit() {
  errorMessage.value = ''
  const trimmed = name.value.trim()
  if (!trimmed) {
    errorMessage.value = '이름을 입력해 주세요.'
    return
  }
  emit('save', trimmed)
}

defineExpose({
  setSaving: (v: boolean) => { saving.value = v },
  setError: (m: string) => { errorMessage.value = m },
})
</script>
