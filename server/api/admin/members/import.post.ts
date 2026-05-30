import { requireAdmin } from '../../../utils/require-admin'
import { parseExcelBuffer } from '../../../utils/excel-members'

const MAX_ROWS = 500

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const form = await readMultipartFormData(event)
  const filePart = form?.find(p => p.name === 'file' && p.data)

  if (!filePart?.data) {
    throw createError({ statusCode: 400, message: '엑셀 파일(file)이 필요합니다.' })
  }

  const { data: categories, error: catError } = await client.from('categories').select('id, name')
  if (catError) {
    throw createError({ statusCode: 500, message: catError.message })
  }

  const categoryNameToId = new Map((categories ?? []).map(c => [c.name.trim(), c.id]))
  const buffer = Buffer.from(filePart.data)
  const { rows, errors: parseErrors } = parseExcelBuffer(buffer, categoryNameToId)

  if (rows.length > MAX_ROWS) {
    throw createError({ statusCode: 400, message: `한 번에 최대 ${MAX_ROWS}행까지 가져올 수 있습니다.` })
  }

  let imported = 0
  const errors = [...parseErrors]

  for (const row of rows) {
    const { error } = await client.from('church_members').insert({
      name: row.name,
      phone: row.phone,
      category_id: row.category_id,
      company_name: row.company_name,
      job_title: row.job_title,
      business_description: row.business_description,
      is_public: row.is_public,
    })

    if (error) {
      errors.push({ row: row.rowNumber, message: error.message })
    }
    else {
      imported++
    }
  }

  return { imported, failed: errors.length, errors }
})
