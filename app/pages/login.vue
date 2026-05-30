<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">교회 직장인 디렉토리</h2>
      <p class="text-center text-sm text-gray-500">등록된 교인 이메일로 로그인해 주세요.</p>

      <form class="mt-8 space-y-4" @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          required
          placeholder="이메일 주소"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '인증 메일 전송 중...' : '인증 메일 받기' }}
        </button>
      </form>

      <p v-if="message" class="text-center text-sm text-green-600 font-medium">{{ message }}</p>
      <p v-if="errorMessage" class="text-center text-sm text-red-600 font-medium">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ supabase: { redirect: false } })

const supabase = useSupabaseClient()
const config = useRuntimeConfig()

/** Magic Link 리다이렉트 — Vercel에서는 NUXT_PUBLIC_SITE_URL 또는 브라우저 origin 사용 */
function getAuthRedirectOrigin(): string {
  if (import.meta.client) {
    return window.location.origin
  }
  const siteUrl = config.public.siteUrl as string
  if (siteUrl) {
    return siteUrl.replace(/\/$/, '')
  }
  return useRequestURL().origin
}

const email = ref('')
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  message.value = ''
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${getAuthRedirectOrigin()}/confirm`,
    },
  })

  loading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  message.value = '이메일로 인증 링크가 전송되었습니다! 메일함을 확인해 주세요.'
}
</script>
