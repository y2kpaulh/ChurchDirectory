import { requireAdmin } from '../../utils/require-admin'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const { data, error } = await client.from('categories').select('id, name').order('name')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data ?? []
})
