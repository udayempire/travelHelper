import { Hono } from 'hono'
import { getDb } from '../lib/db'

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!header) return cookies
  header.split(';').forEach((pair) => {
    const index = pair.indexOf('=')
    if (index > -1) {
      const key = pair.slice(0, index).trim()
      const value = pair.slice(index + 1).trim()
      cookies[key] = decodeURIComponent(value)
    }
  })
  return cookies
}

const adminRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

adminRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({} as any)) as { email?: string; password?: string; blockchainId?: string }

    if (!body?.email && !body?.blockchainId) {
      return c.json({ error: 'Provide email or blockchainId' }, 400)
    }

    if (body.blockchainId && !body.email) {
      // Not implemented due to schema constraints
      return c.json({ error: 'blockchainId login not implemented' }, 501)
    }

    const db = getDb(c.env.DATABASE_URL)
    const user = await db.user.findUnique({ where: { email: body.email! } })
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // NOTE: Password verification not implemented; add passwordHash to schema to enable

    const maxAge = 60 * 60 * 24 // 1 day
    const cookie = `session=${encodeURIComponent(user.id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
    c.header('Set-Cookie', cookie)
    return c.json({ message: 'Logged in', user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    return c.json({ error: 'Failed to login' }, 500)
  }
})

adminRouter.post('/logout', async (c) => {
  const cookie = `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  c.header('Set-Cookie', cookie)
  return c.json({ message: 'Logged out' })
})

adminRouter.get('/me', async (c) => {
  try {
    const cookies = parseCookies(c.req.header('Cookie')!)
    const sessionId = cookies['session']
    if (!sessionId) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const db = getDb(c.env.DATABASE_URL)
    const user = await db.user.findUnique({ where: { id: sessionId } })
    if (!user) {
      return c.json({ error: 'Session invalid' }, 401)
    }

    return c.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt })
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

export { adminRouter }


