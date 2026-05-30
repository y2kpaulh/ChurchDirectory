export const MEMBER_EXPORT_SELECT_FULL =
  'name, phone, company_name, job_title, business_description, website_url, cell_info, other_info, is_public, categories(name)'

export const MEMBER_EXPORT_SELECT_LEGACY =
  'name, phone, company_name, job_title, business_description, is_public, categories(name)'

export function isMissingColumnError(message: string): boolean {
  return /column|does not exist|schema cache/i.test(message)
}
