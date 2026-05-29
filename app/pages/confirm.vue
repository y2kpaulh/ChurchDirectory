<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <p class="text-lg font-medium text-gray-800">{{ statusMessage }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ supabase: { redirect: false } })

const supabase = useSupabaseClient()
const statusMessage = ref('권한을 확인하는 중입니다...')

async function verifyApproval() {
  try {
    const { data, error } = await useFetch('/api/check-user')

    if (error.value) {
      statusMessage.value = '권한 확인 중 오류가 발생했습니다. 다시 로그인해 주세요.'
      await supabase.auth.signOut()
      return
    }

    if (data.value?.approved) {
      await navigateTo('/')
      return
    }

    statusMessage.value = '승인되지 않은 계정입니다. 관리자에게 승인 요청을 해주세요.'
    await supabase.auth.signOut()
  }
  catch {
    statusMessage.value = '권한 확인 중 오류가 발생했습니다. 다시 로그인해 주세요.'
    await supabase.auth.signOut()
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await verifyApproval()
    return
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
    if (newSession && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
      subscription.unsubscribe()
      await verifyApproval()
    }
  })
})
</script>
