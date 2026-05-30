import { serverSupabaseClient } from '#supabase/server'

/** 비로그인 메인 화면용 공개 목록 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const from = (page - 1) * limit
  const to = from + limit - 1
  const search = String(query.q || '').trim()
  const categoryId = query.category_id ? Number(query.category_id) : null

  const client = await serverSupabaseClient(event)

  let dbQuery = client
    .from('church_members')
    .select('id, name, phone, company_name, job_title, business_description, categories(name)', { count: 'exact' })
    .eq('is_public', true)
    .order('company_name', { ascending: true })
    .range(from, to)

  if (categoryId) {
    dbQuery = dbQuery.eq('category_id', categoryId)
  }
  if (search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${search}%,company_name.ilike.%${search}%,business_description.ilike.%${search}%`,
    )
  }

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
      data: { code: error.code, hint: '002_public_read.sql 및 004_grants_anon.sql 실행 확인' },
    })
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
    hasNextPage: (data?.length ?? 0) === limit,
  }
})
