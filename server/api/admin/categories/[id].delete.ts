import { requireAdmin } from '../../../utils/require-admin'

export default defineEventHandler(async (event) => {
  const { client } = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, message: '잘못된 ID입니다.' })
  }

  const { error } = await client.from('categories').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true }
})
