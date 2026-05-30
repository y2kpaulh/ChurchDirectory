// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-05-25',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Vercel: NUXT_PUBLIC_SITE_URL=https://your-app.vercel.app
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
    },
  },
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  supabase: {
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      // localhost(http)에서 secure 쿠키는 저장되지 않아 로그인 직후 /login으로 튕김
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm'],
    },
  },
})