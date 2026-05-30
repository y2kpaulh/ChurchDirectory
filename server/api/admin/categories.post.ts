import { requireAdmin } from '../../utils/require-admin'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const body = await readBody<{ name?: string }>(event)

  const name = body?.name?.trim()
  if (!name) {
    throw createError({ statusCode: 400, message: '카테고리 이름은 필수입니다.' })
  }

  const { data, error } = await client
    .from('categories')
    .insert({ name })
    .select('id, name')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: '이미 같은 이름의 카테고리가 있습니다.' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
