<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          교회 직장인 디렉토리
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
          누구나 공개 목록을 검색할 수 있습니다
        </p>
      </div>
      <NuxtLink
        :to="adminLink"
        class="shrink-0 p-2.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
        :title="isAdmin ? '항목 관리' : '관리자 로그인'"
        :aria-label="isAdmin ? '항목 관리' : '관리자 로그인'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const isAdmin = ref(false)

const adminLink = computed(() => (isAdmin.value ? '/admin' : '/login'))

watch(user, async (u) => {
  if (!u) {
    isAdmin.value = false
    return
  }
  try {
    const data = await $fetch<{ isAdmin: boolean }>('/api/check-user')
    isAdmin.value = !!data?.isAdmin
  }
  catch {
    isAdmin.value = false
  }
}, { immediate: true })
</script>
