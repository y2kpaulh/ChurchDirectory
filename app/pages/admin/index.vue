<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-900">항목 관리</h1>
          <p class="text-sm text-gray-500">추가 · 수정 · 삭제 · 엑셀</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            @click="openCreate"
          >
            + 추가
          </button>
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            :disabled="exporting"
            @click="exportExcel"
          >
            {{ exporting ? '보내는 중...' : '엑셀 보내기' }}
          </button>
          <label class="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer">
            {{ importing ? '가져오는 중...' : '엑셀 가져오기' }}
            <input type="file" accept=".xlsx,.xls" class="hidden" :disabled="importing" @change="importExcel">
          </label>
          <NuxtLink to="/" class="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
            목록 보기
          </NuxtLink>
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300"
            @click="handleLogout"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="이름·회사·업무 검색..."
          class="flex-1 p-2.5 border rounded-lg"
          @input="debouncedLoad"
        >
        <select v-model="filterCategory" class="sm:w-48 p-2.5 border rounded-lg bg-white" @change="loadMembers">
          <option value="">
            전체 업종
          </option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <p v-if="importResult" class="mb-4 text-sm rounded-lg px-4 py-3" :class="importResult.failed ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-green-50 text-green-800 border border-green-200'">
        가져오기 완료: 성공 {{ importResult.imported }}건
        <template v-if="importResult.failed">, 실패 {{ importResult.failed }}건</template>
        <span v-if="importResult.errors?.length" class="block mt-1 text-xs">
          {{ importResult.errors.slice(0, 5).map(e => `${e.row}행: ${e.message}`).join(' · ') }}
          <template v-if="importResult.errors.length > 5"> …</template>
        </span>
      </p>

      <p v-if="loadError" class="text-sm text-red-600 mb-4">{{ loadError }}</p>

      <div v-if="pending" class="text-center py-12 text-gray-500">
        불러오는 중...
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th class="px-4 py-3 font-medium">
                  회사명
                </th>
                <th class="px-4 py-3 font-medium">
                  이름
                </th>
                <th class="px-4 py-3 font-medium">
                  업종
                </th>
                <th class="px-4 py-3 font-medium">
                  공개
                </th>
                <th class="px-4 py-3 font-medium text-right">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in members" :key="row.id" class="border-b border-gray-100 hover:bg-gray-50/80">
                <td class="px-4 py-3">
                  {{ row.company_name || '—' }}
                </td>
                <td class="px-4 py-3">
                  {{ row.name }}
                </td>
                <td class="px-4 py-3">
                  {{ row.categories?.name || '—' }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="row.is_public ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ row.is_public ? '공개' : '비공개' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button type="button" class="text-blue-600 hover:underline mr-3" @click="openEdit(row)">
                    수정
                  </button>
                  <button type="button" class="text-red-600 hover:underline" @click="remove(row)">
                    삭제
                  </button>
                </td>
              </tr>
              <tr v-if="members.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-gray-500">
                  등록된 항목이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 border-t text-sm text-gray-500 flex justify-between items-center">
          <span>총 {{ total }}건</span>
          <div class="flex gap-2">
            <button
              type="button"
              class="px-3 py-1 border rounded disabled:opacity-40"
              :disabled="page === 1"
              @click="page--; loadMembers()"
            >
              이전
            </button>
            <span>{{ page }}페이지</span>
            <button
              type="button"
              class="px-3 py-1 border rounded disabled:opacity-40"
              :disabled="page * limit >= total"
              @click="page++; loadMembers()"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>

    <AdminMemberForm
      v-if="showForm"
      ref="formRef"
      :editing="!!editingId"
      :initial="formInitial"
      :categories="categories"
      @close="showForm = false"
      @save="saveMember"
    />
  </div>
</template>

<script setup lang="ts">
import type { MemberFormModel } from '~/components/AdminMemberForm.vue'

definePageMeta({ supabase: { redirect: false } })

interface AdminMember {
  id: number
  name: string
  phone: string | null
  category_id: number | null
  company_name: string | null
  job_title: string | null
  business_description: string | null
  is_public: boolean
  categories: { name: string } | null
}

interface CategoryOption {
  id: number
  name: string
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { signOut } = useAdminAuth()

const members = ref<AdminMember[]>([])
const categories = ref<CategoryOption[]>([])
const pending = ref(true)
const loadError = ref('')
const page = ref(1)
const limit = 50
const total = ref(0)
const searchQuery = ref('')
const filterCategory = ref<number | ''>('')
const showForm = ref(false)
const editingId = ref<number | null>(null)
const formInitial = ref<MemberFormModel | null>(null)
const formRef = ref<{ setSaving: (v: boolean) => void, setError: (m: string) => void } | null>(null)
const exporting = ref(false)
const importing = ref(false)
const importResult = ref<{ imported: number, failed: number, errors: { row: number, message: string }[] } | null>(null)

let debounceTimer: ReturnType<typeof setTimeout>

async function ensureAdmin() {
  if (!user.value) {
    await navigateTo('/login')
    return false
  }
  try {
    const data = await $fetch<{ isAdmin: boolean }>('/api/check-user')
    if (!data?.isAdmin) {
      await supabase.auth.signOut()
      await navigateTo({ path: '/', query: { admin_denied: '1' } })
      return false
    }
    return true
  }
  catch {
    await navigateTo('/login')
    return false
  }
}

async function loadCategories() {
  categories.value = await $fetch<CategoryOption[]>('/api/admin/categories')
}

async function loadMembers() {
  pending.value = true
  loadError.value = ''
  try {
    const res = await $fetch<{ items: AdminMember[], total: number }>('/api/admin/members', {
      query: {
        page: page.value,
        limit,
        q: searchQuery.value.trim() || undefined,
        category_id: filterCategory.value !== '' ? filterCategory.value : undefined,
      },
    })
    members.value = res.items
    total.value = res.total
  }
  catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : '목록을 불러오지 못했습니다.'
  }
  finally {
    pending.value = false
  }
}

function debouncedLoad() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    loadMembers()
  }, 300)
}

function memberToForm(m: AdminMember): MemberFormModel {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone ?? '',
    category_id: m.category_id ?? '',
    company_name: m.company_name ?? '',
    job_title: m.job_title ?? '',
    business_description: m.business_description ?? '',
    is_public: m.is_public,
  }
}

function openCreate() {
  editingId.value = null
  formInitial.value = {
    name: '',
    phone: '',
    category_id: '',
    company_name: '',
    job_title: '',
    business_description: '',
    is_public: true,
  }
  showForm.value = true
}

function openEdit(row: AdminMember) {
  editingId.value = row.id
  formInitial.value = memberToForm(row)
  showForm.value = true
}

function bodyFromForm(f: MemberFormModel) {
  return {
    name: f.name,
    phone: f.phone || null,
    category_id: f.category_id === '' ? null : Number(f.category_id),
    company_name: f.company_name || null,
    job_title: f.job_title || null,
    business_description: f.business_description || null,
    is_public: f.is_public,
  }
}

async function saveMember(form: MemberFormModel) {
  formRef.value?.setSaving(true)
  formRef.value?.setError('')
  try {
    const body = bodyFromForm(form)
    if (editingId.value) {
      await $fetch(`/api/admin/members/${editingId.value}`, { method: 'PUT', body })
    }
    else {
      await $fetch('/api/admin/members', { method: 'POST', body })
    }
    showForm.value = false
    await loadMembers()
  }
  catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e && (e.data as { message?: string })?.message
      ? (e.data as { message: string }).message
      : '저장에 실패했습니다.'
    formRef.value?.setError(msg)
  }
  finally {
    formRef.value?.setSaving(false)
  }
}

async function remove(row: AdminMember) {
  if (!confirm(`"${row.name}" 항목을 삭제할까요?`)) {
    return
  }
  try {
    await $fetch(`/api/admin/members/${row.id}`, { method: 'DELETE' })
    await loadMembers()
  }
  catch {
    alert('삭제에 실패했습니다.')
  }
}

async function exportExcel() {
  exporting.value = true
  try {
    const blob = await $fetch<Blob>('/api/admin/members/export', { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `church_members_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }
  catch {
    alert('엑셀보내기에 실패했습니다.')
  }
  finally {
    exporting.value = false
  }
}

async function importExcel(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }

  importing.value = true
  importResult.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    importResult.value = await $fetch('/api/admin/members/import', { method: 'POST', body: form })
    await loadMembers()
  }
  catch {
    alert('엑셀 가져오기에 실패했습니다.')
  }
  finally {
    importing.value = false
  }
}

async function handleLogout() {
  await signOut()
  await navigateTo('/')
}

watch(user, async () => {
  if (await ensureAdmin()) {
    await loadCategories()
    await loadMembers()
  }
}, { immediate: true })
</script>
