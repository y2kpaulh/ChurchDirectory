import { requireAdmin } from '../../../utils/require-admin'
import { buildExportWorkbook } from '../../../utils/excel-members'
import {
  isMissingColumnError,
  MEMBER_EXPORT_SELECT_FULL,
  MEMBER_EXPORT_SELECT_LEGACY,
} from '../../../utils/member-export-select'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)

  let { data, error } = await client
    .from('church_members')
    .select(MEMBER_EXPORT_SELECT_FULL)
    .order('company_name', { ascending: true })

  if (error && isMissingColumnError(error.message)) {
    const legacy = await client
      .from('church_members')
      .select(MEMBER_EXPORT_SELECT_LEGACY)
      .order('company_name', { ascending: true })
    data = legacy.data
    error = legacy.error
  }

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const buffer = buildExportWorkbook(data ?? [])
  const filename = `church_members_${new Date().toISOString().slice(0, 10)}.xlsx`

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(event, 'Content-Length', String(buffer.byteLength))

  return new Uint8Array(buffer)
})
