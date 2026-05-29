<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8 border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">교인 비즈니스 네트워킹 디렉토리</h1>
      <button
        type="button"
        class="text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="이름, 회사명, 업무 키워드로 검색..."
        class="flex-1 p-3 border rounded-lg shadow-sm"
        @input="onSearchInput"
      >
      <select
        v-model="selectedCategory"
        class="p-3 border rounded-lg shadow-sm bg-white"
        @change="onCategoryChange"
      >
        <option value="">
          전체 업종 카테고리
        </option>
        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div v-if="pending" class="text-center py-12 text-gray-500">
      데이터 로드 중...
    </div>
    <div v-else-if="members.length === 0" class="text-center py-12 text-gray-500">
      표시할 교인 정보가 없습니다. (공개 설정된 항목만 보입니다)
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="item in members"
        :key="item.id"
        class="p-5 border rounded-xl shadow-sm bg-white hover:border-blue-300 transition"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-gray-900">
            {{ item.company_name || '(회사명 없음)' }}
          </h3>
          <span
            v-if="item.categories?.name"
            class="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium shrink-0 ml-2"
          >
            {{ item.categories.name }}
          </span>
        </div>
        <p class="text-sm text-gray-700 mb-4 h-10 overflow-hidden text-ellipsis">
          {{ item.business_description || '—' }}
        </p>
        <div class="text-xs text-gray-500 border-t pt-3 flex justify-between gap-2">
          <span><strong>대표/담당:</strong> {{ item.name }} ({{ item.job_title || '—' }})</span>
          <a
            v-if="item.phone"
            :href="`tel:${item.phone}`"
            class="text-blue-600 font-semibold hover:underline shrink-0"
          >전화 연결</a>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-4 mt-10">
      <button
        type="button"
        class="px-4 py-2 border rounded disabled:opacity-40"
        :disabled="page === 1"
        @click="changePage(-1)"
      >
        이전
      </button>
      <span class="text-sm text-gray-600">{{ page }} 페이지</span>
      <button
        type="button"
        class="px-4 py-2 border rounded disabled:opacity-40"
        :disabled="!hasNextPage"
        @click="changePage(1)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  name: string
}

interface Member {
  id: number
  name: string
  phone: string | null
  company_name: string | null
  job_title: string | null
  business_description: string | null
  categories: { name: string } | null
}

const supabase = useSupabaseClient()

const searchQuery = ref('')
const selectedCategory = ref<number | ''>('')
const page = ref(1)
const itemsPerPage = 20
const members = ref<Member[]>([])
const categories = ref<Category[]>([])
const pending = ref(false)
const hasNextPage = ref(false)

let debounceTimeout: ReturnType<typeof setTimeout>

const { data: catData } = await useAsyncData('categories', async () => {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) {
    console.error(error)
    return []
  }
  return data ?? []
})

categories.value = catData.value ?? []

async function fetchMembers() {
  pending.value = true

  const from = (page.value - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  let query = supabase
    .from('church_members')
    .select('*, categories(name)')
    .eq('is_public', true)
    .order('company_name')
    .range(from, to)

  if (selectedCategory.value !== '') {
    query = query.eq('category_id', selectedCategory.value)
  }

  const term = searchQuery.value.trim()
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,company_name.ilike.%${term}%,business_description.ilike.%${term}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    members.value = []
    hasNextPage.value = false
  }
  else {
    members.value = (data ?? []) as Member[]
    hasNextPage.value = members.value.length === itemsPerPage
  }

  pending.value = false
}

function onSearchInput() {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    page.value = 1
    fetchMembers()
  }, 300)
}

function onCategoryChange() {
  page.value = 1
  fetchMembers()
}

function changePage(step: number) {
  page.value += step
  fetchMembers()
}

async function handleLogout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}

onMounted(() => {
  fetchMembers()
})
</script>
