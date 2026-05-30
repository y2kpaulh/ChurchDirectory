<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <p
        v-if="showAdminDenied"
        class="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3"
      >
        관리자로 등록되지 않은 계정입니다. 목록은 로그인 없이 이용할 수 있습니다.
      </p>

      <!-- 검색·필터 -->
      <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <label class="flex-1 block">
            <span class="sr-only">검색</span>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="이름, 회사명, 업무 키워드 검색..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="onSearchInput"
              >
            </div>
          </label>
          <label class="sm:w-56 block">
            <span class="sr-only">업종 카테고리</span>
            <select
              v-model="selectedCategory"
              class="w-full py-3 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="onCategoryChange"
            >
              <option value="">
                전체 업종
              </option>
              <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </label>
        </div>
        <p v-if="!memberError" class="mt-3 text-sm text-gray-500">
          <template v-if="pending">목록을 불러오는 중…</template>
          <template v-else-if="members.length > 0">
            {{ resultSummary }}
          </template>
          <template v-else>
            조건에 맞는 공개 항목이 없습니다.
          </template>
        </p>
      </section>

      <p v-if="categoryError" class="mb-4 text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg py-4 px-4">
        {{ categoryError }}
        <span class="block mt-1 text-gray-600 text-xs">
          Supabase SQL Editor에서
          <code class="bg-red-100 px-1 rounded">002_public_read.sql</code>,
          <code class="bg-red-100 px-1 rounded">004_grants_anon.sql</code>
          순서로 실행해 주세요.
        </span>
      </p>
      <p v-if="memberError" class="mb-6 text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg py-4 px-4">
        {{ memberError }}
      </p>

      <!-- 목록 -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="n in 4"
          :key="n"
          class="h-40 bg-white border border-gray-200 rounded-xl animate-pulse"
        />
      </div>

      <div
        v-else-if="members.length === 0 && !memberError"
        class="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300"
      >
        <p class="text-gray-600 font-medium">표시할 항목이 없습니다</p>
        <p class="text-sm text-gray-500 mt-2">검색어나 카테고리를 바꿔 보시거나, 공개 설정된 데이터가 있는지 확인해 주세요.</p>
      </div>

      <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
        <li
          v-for="item in members"
          :key="item.id"
          class="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md transition overflow-hidden"
        >
          <div class="p-5">
            <div class="flex justify-between items-start gap-2 mb-2">
              <h2 class="text-lg font-bold text-gray-900 leading-snug">
                {{ item.company_name || '(회사명 없음)' }}
              </h2>
              <span
                v-if="item.categories?.name"
                class="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium shrink-0"
              >
                {{ item.categories.name }}
              </span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-4">
              {{ item.business_description || '업무 설명이 없습니다.' }}
            </p>
            <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
              <span>
                <span class="text-gray-400">담당</span>
                {{ item.name }}
                <span v-if="item.job_title" class="text-gray-400">· {{ item.job_title }}</span>
              </span>
              <a
                v-if="item.phone"
                :href="`tel:${item.phone}`"
                class="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
              >
                전화
              </a>
            </div>
          </div>
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <nav
        v-if="members.length > 0 && !pending"
        class="flex justify-center items-center gap-4 mt-10"
        aria-label="페이지 이동"
      >
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="page === 1"
          @click="changePage(-1)"
        >
          이전
        </button>
        <span class="text-sm text-gray-600 tabular-nums">{{ page }}페이지</span>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasNextPage"
          @click="changePage(1)"
        >
          다음
        </button>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ supabase: { redirect: false } })

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

const route = useRoute()
const router = useRouter()

const showAdminDenied = ref(route.query.admin_denied === '1')

const searchQuery = ref('')
const selectedCategory = ref<number | ''>('')
const page = ref(1)
const itemsPerPage = 20
const members = ref<Member[]>([])
const categories = ref<Category[]>([])
const pending = ref(true)
const hasNextPage = ref(false)
const categoryError = ref('')
const memberError = ref('')

let debounceTimeout: ReturnType<typeof setTimeout>

const resultSummary = computed(() => {
  const cat = selectedCategory.value !== ''
    ? categories.value.find(c => c.id === selectedCategory.value)?.name
    : null
  const parts = [`${members.value.length}건 표시`]
  if (searchQuery.value.trim()) {
    parts.push(`검색: "${searchQuery.value.trim()}"`)
  }
  if (cat) {
    parts.push(`업종: ${cat}`)
  }
  return parts.join(' · ')
})

async function loadCategories() {
  categoryError.value = ''
  try {
    categories.value = await $fetch<Category[]>('/api/public/categories')
  }
  catch (e: unknown) {
    const msg = extractFetchError(e)
    categoryError.value = msg
      ? `카테고리를 불러오지 못했습니다. (${msg})`
      : '카테고리를 불러오지 못했습니다.'
    categories.value = []
  }
}

async function fetchMembers() {
  pending.value = true
  memberError.value = ''

  try {
    const res = await $fetch<{
      items: Member[]
      hasNextPage: boolean
    }>('/api/public/members', {
      query: {
        page: page.value,
        limit: itemsPerPage,
        q: searchQuery.value.trim() || undefined,
        category_id: selectedCategory.value !== '' ? selectedCategory.value : undefined,
      },
    })
    members.value = res.items
    hasNextPage.value = res.hasNextPage
  }
  catch (e: unknown) {
    const msg = extractFetchError(e)
    memberError.value = msg
      ? `목록을 불러오지 못했습니다. (${msg})`
      : '목록을 불러오지 못했습니다.'
    members.value = []
    hasNextPage.value = false
    console.error(e)
  }
  finally {
    pending.value = false
  }
}

function extractFetchError(e: unknown): string | null {
  if (e && typeof e === 'object') {
    if ('data' in e) {
      const d = (e as { data?: { message?: string } }).data
      if (d?.message) return d.message
    }
    if ('statusMessage' in e && (e as { statusMessage?: string }).statusMessage) {
      return (e as { statusMessage: string }).statusMessage
    }
  }
  return null
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

onMounted(async () => {
  if (showAdminDenied.value) {
    const q = { ...route.query }
    delete q.admin_denied
    router.replace({ query: q })
  }
  try {
    await loadCategories()
    await fetchMembers()
  }
  catch {
    pending.value = false
  }
})
</script>
