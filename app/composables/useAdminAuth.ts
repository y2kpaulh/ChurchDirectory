export function useAdminAuth() {
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()

  function getAuthOrigin(): string {
    if (import.meta.client) {
      return window.location.origin
    }
    const siteUrl = (config.public.siteUrl as string)?.replace(/\/$/, '')
    if (siteUrl) {
      return siteUrl
    }
    return useRequestURL().origin
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getAuthOrigin()}/confirm`,
        queryParams: { prompt: 'select_account' },
      },
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { signInWithGoogle, signOut, getAuthOrigin }
}
