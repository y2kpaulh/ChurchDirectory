import { requireAdmin } from '../../../utils/require-admin'
import { buildExportWorkbook } from '../../../utils/excel-members'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)

  const { data, error } = await client
    .from('church_members')
    .select('name, phone, company_name, job_title, business_description, website_url, cell_info, other_info, is_public, categories(name)')
    .order('company_name', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const buffer = buildExportWorkbook(data ?? [])
  const filename = `church_members_${new Date().toISOString().slice(0, 10)}.xlsx`

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)

  return buffer
})
