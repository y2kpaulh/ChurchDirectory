/**
 * implicit flow(hash) 또는 클라이언트 라우팅 시에도 /confirm 으로 보냄
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  function redirectAuthToConfirm() {
    const route = useRoute()
    if (route.path === '/confirm') {
      return
    }

    const hash = window.location.hash
    if (hash && (hash.includes('access_token') || hash.includes('type='))) {
      return navigateTo({ path: '/confirm', hash }, { replace: true })
    }

    const q = route.query
    if (q.code || q.token_hash || q.error || q.error_description) {
      return navigateTo({ path: '/confirm', query: q, hash: route.hash }, { replace: true })
    }
  }

  redirectAuthToConfirm()
  router.beforeEach((to) => {
    if (to.path === '/confirm') {
      return
    }
    if (to.query.code || to.query.token_hash || to.query.error || to.query.error_description) {
      return navigateTo({ path: '/confirm', query: to.query, hash: to.hash }, { replace: true })
    }
  })
})
