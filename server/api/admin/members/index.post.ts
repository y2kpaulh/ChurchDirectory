import { requireAdmin } from '../../../utils/require-admin'
import { normalizeWebsiteUrlOrThrow } from '../../../utils/normalize-url'

interface MemberBody {
  name?: string
  phone?: string | null
  category_id?: number | null
  company_name?: string | null
  job_title?: string | null
  business_description?: string | null
  website_url?: string | null
  cell_info?: string | null
  other_info?: string | null
  is_public?: boolean
}

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const body = await readBody<MemberBody>(event)

  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, message: '이름은 필수입니다.' })
  }

  const { data, error } = await client
    .from('church_members')
    .insert({
      name: body.name.trim(),
      phone: body.phone?.trim() || null,
      category_id: body.category_id ?? null,
      company_name: body.company_name?.trim() || null,
      job_title: body.job_title?.trim() || null,
      business_description: body.business_description?.trim() || null,
      website_url: normalizeWebsiteUrlOrThrow(body.website_url),
      cell_info: body.cell_info?.trim() || null,
      other_info: body.other_info?.trim() || null,
      is_public: !!body.is_public,
    })
    .select('id, name, phone, category_id, company_name, job_title, business_description, website_url, cell_info, other_info, is_public, categories(name)')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
