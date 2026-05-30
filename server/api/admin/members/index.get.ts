import { requireAdmin } from '../../../utils/require-admin'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50))
  const from = (page - 1) * limit
  const to = from + limit - 1
  const search = String(query.q || '').trim()
  const categoryId = query.category_id ? Number(query.category_id) : null

  let dbQuery = client
    .from('church_members')
    .select('id, name, phone, category_id, company_name, job_title, business_description, is_public, categories(name)', { count: 'exact' })
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
    throw createError({ statusCode: 500, message: error.message })
  }

  return { items: data ?? [], total: count ?? 0, page, limit }
})
