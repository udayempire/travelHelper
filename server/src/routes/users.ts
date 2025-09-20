import { Hono } from 'hono'
import { getDb } from '../lib/db'

const usersRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

// POST /api/admin/users
usersRouter.post('/', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      name: string
      email: string
      role?: 'ADMIN' | 'AUTHORITY'
    }
    
    // Input validation
    if (!body.name || !body.email) {
      return c.json({ error: 'Name and email are required' }, 400)
    }
    
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return c.json({ error: 'Name must be a non-empty string' }, 400)
    }
    
    if (typeof body.email !== 'string' || !body.email.includes('@')) {
      return c.json({ error: 'Valid email is required' }, 400)
    }
    
    if (body.role && !['ADMIN', 'AUTHORITY'].includes(body.role)) {
      return c.json({ error: 'Role must be either ADMIN or AUTHORITY' }, 400)
    }

    const db = getDb(c.env.DATABASE_URL)
    const existing = await db.user.findUnique({ where: { email: body.email.trim().toLowerCase() } })
    if (existing) return c.json({ error: 'User with this email already exists' }, 409)

    const created = await db.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        role: (body.role as any) || 'AUTHORITY',
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return c.json({ message: 'User created successfully', user: created }, 201)
  } catch (error) {
    console.error('User creation error:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// GET /api/admin/users
usersRouter.get('/', async (c) => {
  try {
    const role = c.req.query('role') as 'ADMIN' | 'AUTHORITY' | undefined
    const search = c.req.query('search')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
    const where: any = {}
    if (role && ['ADMIN', 'AUTHORITY'].includes(role)) {
      where.role = role
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const db = getDb(c.env.DATABASE_URL)
    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Cap at 100
      skip: offset,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true,
        _count: {
          select: {
            alerts: true,
            logs: true
          }
        }
      },
    })
    
    const total = await db.user.count({ where })
    
    return c.json({ 
      users,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Fetch users error:', error)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// GET /api/admin/users/:id
usersRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DATABASE_URL)
    
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        alerts: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        logs: {
          select: {
            id: true,
            action: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            alerts: true,
            logs: true
          }
        }
      }
    })
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json({ user })
  } catch (error) {
    console.error('Fetch user error:', error)
    return c.json({ error: 'Failed to fetch user' }, 500)
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

    const db = getDb(c.env.DATABASE_URL)
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
    const db = getDb(c.env.DATABASE_URL)
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'User not found' }, 404)
    await db.user.delete({ where: { id } })
    return c.json({ message: 'User deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500)
  }
})

export { usersRouter }


