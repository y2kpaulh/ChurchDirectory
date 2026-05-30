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

const statusMessage = ref('로그인을 확인하는 중입니다...')
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

/** PKCE 코드 교환·쿠키 반영까지 대기 */
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

async function verifyApproval() {
  if (verifying.value || !user.value) {
    return
  }
  verifying.value = true

  try {
    const data = await $fetch<{ approved: boolean }>('/api/check-user')

    if (data?.approved) {
      if (!session.value) {
        const ready = await waitForSession(5000)
        if (!ready) {
          statusMessage.value = '세션 동기화에 실패했습니다. 다시 로그인해 주세요.'
          await supabase.auth.signOut()
          await navigateTo('/login')
          return
        }
      }
      await navigateTo('/', { replace: true })
      return
    }

    statusMessage.value = '승인되지 않은 계정입니다. 관리자에게 승인 요청을 해주세요.'
    await supabase.auth.signOut()
  }
  catch {
    statusMessage.value = '권한 확인 중 오류가 발생했습니다. 다시 로그인해 주세요.'
    await supabase.auth.signOut()
  }
  finally {
    verifying.value = false
  }
}

watch(user, (u) => {
  if (u) {
    statusMessage.value = '권한을 확인하는 중입니다...'
    verifyApproval()
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
      statusMessage.value = '인증 링크가 만료되었거나 처리에 실패했습니다. 인증 메일을 다시 요청해 주세요.'
      await navigateTo('/login')
    }
    return
  }

  if (!user.value && !route.query.code) {
    window.setTimeout(async () => {
      if (!user.value) {
        statusMessage.value = '로그인 세션이 확인되지 않았습니다. 다시 시도해 주세요.'
        await navigateTo('/login')
      }
    }, 12000)
  }
})
</script>
