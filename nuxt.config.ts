// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-05-25',
  devtools: { enabled: true },
  app: {
    head: {
      title: '수원하나교회 성도 사업장',
      meta: [{ name: 'description', content: '교회 성도 직장·사업 정보 검색' }],
    },
  },
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
      // 목록(/)은 누구나 — 로그인은 관리자·항목 관리(/admin)만 필요
      include: ['/admin', '/admin/**'],
      exclude: ['/login', '/confirm'],
      saveRedirectToCookie: true,
    },
  },
})