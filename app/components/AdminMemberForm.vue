<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="$emit('close')">
    <form
      class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
      @submit.prevent="submit"
    >
      <h3 class="text-lg font-bold text-gray-900">
        {{ editing ? '항목 수정' : '항목 추가' }}
      </h3>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">이름 *</span>
        <input v-model="form.name" required class="mt-1 w-full p-2.5 border rounded-lg" >
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">전화</span>
        <input v-model="form.phone" type="tel" class="mt-1 w-full p-2.5 border rounded-lg" >
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">업종</span>
        <select v-model="form.category_id" class="mt-1 w-full p-2.5 border rounded-lg bg-white">
          <option value="">
            (없음)
          </option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">회사명</span>
        <input v-model="form.company_name" class="mt-1 w-full p-2.5 border rounded-lg" >
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">직함</span>
        <input v-model="form.job_title" class="mt-1 w-full p-2.5 border rounded-lg" >
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">업무 설명</span>
        <textarea v-model="form.business_description" rows="3" class="mt-1 w-full p-2.5 border rounded-lg" />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">URL</span>
        <input
          v-model="form.website_url"
          type="url"
          placeholder="https://example.com"
          class="mt-1 w-full p-2.5 border rounded-lg"
        >
        <span class="text-xs text-gray-500 mt-1 block">홈페이지·블로그·SNS 등 (선택)</span>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">소속 Cell</span>
        <input
          v-model="form.cell_info"
          placeholder="예: 청년부 1셀"
          class="mt-1 w-full p-2.5 border rounded-lg"
        >
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700">기타 정보</span>
        <textarea
          v-model="form.other_info"
          rows="2"
          placeholder="참고 사항 (선택)"
          class="mt-1 w-full p-2.5 border rounded-lg"
        />
      </label>

      <label class="flex items-center gap-2">
        <input v-model="form.is_public" type="checkbox" class="rounded" >
        <span class="text-sm text-gray-700">메인 목록에 공개</span>
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
export interface CategoryOption {
  id: number
  name: string
}

export interface MemberFormModel {
  id?: number
  name: string
  phone: string
  category_id: number | ''
  company_name: string
  job_title: string
  business_description: string
  website_url: string
  cell_info: string
  other_info: string
  is_public: boolean
}

const props = defineProps<{
  editing: boolean
  initial: MemberFormModel | null
  categories: CategoryOption[]
}>()

const emit = defineEmits<{
  close: []
  save: [payload: MemberFormModel]
}>()

const saving = ref(false)
const errorMessage = ref('')

const form = ref<MemberFormModel>({
  name: '',
  phone: '',
  category_id: '',
  company_name: '',
  job_title: '',
  business_description: '',
  website_url: '',
  cell_info: '',
  other_info: '',
  is_public: true,
})

watch(() => props.initial, (v) => {
  if (v) {
    form.value = { ...v }
  }
}, { immediate: true })

function submit() {
  errorMessage.value = ''
  if (!form.value.name.trim()) {
    errorMessage.value = '이름을 입력해 주세요.'
    return
  }
  emit('save', { ...form.value })
}

defineExpose({ setSaving: (v: boolean) => { saving.value = v }, setError: (m: string) => { errorMessage.value = m } })
</script>
