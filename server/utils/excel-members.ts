import * as XLSX from 'xlsx'

export const EXCEL_HEADERS = ['이름', '전화', '업종', '회사명', '직함', '업무설명', '공개'] as const

export interface MemberRowInput {
  name: string
  phone: string | null
  category_id: number | null
  company_name: string | null
  job_title: string | null
  business_description: string | null
  is_public: boolean
}

export interface ParsedMemberRow extends MemberRowInput {
  rowNumber: number
}

function cellStr(v: unknown): string {
  if (v == null) return ''
  return String(v).trim()
}

export function parseIsPublic(value: unknown): boolean {
  const s = cellStr(value).toLowerCase()
  if (!s) return false
  return ['y', 'yes', 'true', '1', 'o', '예', '공개', 'yep'].includes(s)
}

export function parseExcelBuffer(
  buffer: Buffer,
  categoryNameToId: Map<string, number>,
): { rows: ParsedMemberRow[], errors: { row: number, message: string }[] } {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) {
    return { rows: [], errors: [{ row: 0, message: '시트가 비어 있습니다.' }] }
  }

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  const rows: ParsedMemberRow[] = []
  const errors: { row: number, message: string }[] = []

  raw.forEach((record, index) => {
    const rowNumber = index + 2
    const name = cellStr(record['이름'] ?? record.name)
    if (!name) {
      errors.push({ row: rowNumber, message: '이름이 비어 있습니다.' })
      return
    }

    const categoryName = cellStr(record['업종'] ?? record.category)
    let category_id: number | null = null
    if (categoryName) {
      const id = categoryNameToId.get(categoryName)
      if (id == null) {
        errors.push({ row: rowNumber, message: `알 수 없는 업종: ${categoryName}` })
        return
      }
      category_id = id
    }

    rows.push({
      rowNumber,
      name,
      phone: cellStr(record['전화'] ?? record.phone) || null,
      category_id,
      company_name: cellStr(record['회사명'] ?? record.company_name) || null,
      job_title: cellStr(record['직함'] ?? record.job_title) || null,
      business_description: cellStr(record['업무설명'] ?? record.business_description) || null,
      is_public: parseIsPublic(record['공개'] ?? record.is_public),
    })
  })

  return { rows, errors }
}

export function buildExportWorkbook(
  members: Array<{
    name: string
    phone: string | null
    company_name: string | null
    job_title: string | null
    business_description: string | null
    is_public: boolean
    categories: { name: string } | null
  }>,
): Buffer {
  const data = members.map(m => ({
    이름: m.name,
    전화: m.phone ?? '',
    업종: m.categories?.name ?? '',
    회사명: m.company_name ?? '',
    직함: m.job_title ?? '',
    업무설명: m.business_description ?? '',
    공개: m.is_public ? 'Y' : 'N',
  }))

  const sheet = XLSX.utils.json_to_sheet(data, { header: [...EXCEL_HEADERS] })
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, 'church_members')
  return XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
