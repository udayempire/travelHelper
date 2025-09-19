import { Hono } from 'hono'
import db from '../lib/db'

const usersRouter = new Hono()

// POST /api/admin/users
usersRouter.post('/', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      name: string
      email: string
      role?: 'ADMIN' | 'AUTHORITY'
    }
    if (!body.name || !body.email) return c.json({ error: 'Missing name or email' }, 400)

    const existing = await db.user.findUnique({ where: { email: body.email } })
    if (existing) return c.json({ error: 'User already exists' }, 409)

    const created = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: (body.role as any) || 'AUTHORITY',
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return c.json({ message: 'User created', user: created }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// GET /api/admin/users
usersRouter.get('/', async (c) => {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return c.json({ users })
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// PUT /api/admin/users/:id
usersRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = (await c.req.json().catch(() => ({}))) as {
      name?: string
      role?: 'ADMIN' | 'AUTHORITY'
    }

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'User not found' }, 404)

    const updated = await db.user.update({
      where: { id },
      data: body as any,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return c.json({ message: 'User updated', user: updated })
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

// DELETE /api/admin/users/:id
usersRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'User not found' }, 404)
    await db.user.delete({ where: { id } })
    return c.json({ message: 'User deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500)
  }
})

export { usersRouter }


