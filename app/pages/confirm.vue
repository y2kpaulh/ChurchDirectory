<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <p class="text-lg font-medium text-gray-800">{{ statusMessage }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ supabase: { redirect: false } })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const session = useSupabaseSession()
const route = useRoute()

const statusMessage = ref('관리자 로그인을 확인하는 중입니다...')
const verifying = ref(false)

function authErrorFromQuery(): string | null {
  const desc = route.query.error_description
  if (typeof desc === 'string') {
    return decodeURIComponent(desc.replace(/\+/g, ' '))
  }
  const err = route.query.error
  if (typeof err === 'string') {
    return err
  }
  return null
}

async function waitForSession(maxMs = 15000): Promise<boolean> {
  const deadline = Date.now() + maxMs
  while (Date.now() < deadline) {
    if (session.value) {
      return true
    }
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  return false
}

async function verifyAdmin() {
  if (verifying.value || !user.value) {
    return
  }
  verifying.value = true

  try {
    const data = await $fetch<{ isAdmin: boolean }>('/api/check-user')

    if (data?.isAdmin) {
      if (!session.value) {
        const ready = await waitForSession(5000)
        if (!ready) {
          statusMessage.value = '세션 동기화에 실패했습니다.'
          await supabase.auth.signOut()
          await navigateTo('/login')
          return
        }
      }
      await navigateTo('/admin', { replace: true })
      return
    }

    statusMessage.value = '등록된 관리자 계정만 로그인할 수 있습니다.'
    await supabase.auth.signOut()
    await navigateTo({ path: '/', query: { admin_denied: '1' } })
  }
  catch {
    statusMessage.value = '권한 확인 중 오류가 발생했습니다.'
    await supabase.auth.signOut()
    await navigateTo('/login')
  }
  finally {
    verifying.value = false
  }
}

watch(user, (u) => {
  if (u) {
    statusMessage.value = '관리자 권한을 확인하는 중입니다...'
    verifyAdmin()
  }
}, { immediate: true })

onMounted(async () => {
  const queryError = authErrorFromQuery()
  if (queryError) {
    statusMessage.value = `로그인에 실패했습니다: ${queryError}`
    await navigateTo('/login')
    return
  }

  if (typeof route.query.code === 'string' && !user.value) {
    const ready = await waitForSession()
    if (!ready) {
      statusMessage.value = '인증이 만료되었거나 처리에 실패했습니다.'
      await navigateTo('/login')
    }
  }
})
</script>
