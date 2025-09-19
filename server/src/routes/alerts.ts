import { Hono } from 'hono'
import db from '../lib/db'

const alertsRouter = new Hono()

// POST /api/admin/alerts
alertsRouter.post('/', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      title: string
      description?: string
      touristId?: string
      status?: 'ACTIVE' | 'RESOLVED' | 'ONGOING'
      createdById: string
    }
    if (!body.title || !body.createdById) {
      return c.json({ error: 'Missing title or createdById' }, 400)
    }

    const created = await db.alert.create({
      data: {
        title: body.title,
        description: body.description,
        touristId: body.touristId || null,
        status: (body.status as any) || 'ACTIVE',
        createdById: body.createdById,
      },
    })
    return c.json({ message: 'Alert created', alert: created }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create alert' }, 500)
  }
})

// GET /api/admin/alerts
alertsRouter.get('/', async (c) => {
  try {
    const status = c.req.query('status') as 'ACTIVE' | 'RESOLVED' | 'ONGOING' | undefined

    const where: any = {}
    if (status) where.status = status

    const alerts = await db.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tourist: true, createdBy: { select: { id: true, name: true, email: true } } },
    })
    return c.json({ alerts })
  } catch (error) {
    return c.json({ error: 'Failed to fetch alerts' }, 500)
  }
})

// GET /api/admin/alerts/:id
alertsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const alert = await db.alert.findUnique({
      where: { id },
      include: { tourist: true, createdBy: { select: { id: true, name: true, email: true } } },
    })
    if (!alert) return c.json({ error: 'Alert not found' }, 404)
    return c.json({ alert })
  } catch (error) {
    return c.json({ error: 'Failed to fetch alert' }, 500)
  }
})

// PUT /api/admin/alerts/:id
alertsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = (await c.req.json().catch(() => ({}))) as {
      title?: string
      description?: string
      status?: 'ACTIVE' | 'RESOLVED' | 'ONGOING'
      touristId?: string | null
    }

    const existing = await db.alert.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'Alert not found' }, 404)

    const updated = await db.alert.update({
      where: { id },
      data: body as any,
    })
    return c.json({ message: 'Alert updated', alert: updated })
  } catch (error) {
    return c.json({ error: 'Failed to update alert' }, 500)
  }
})

// DELETE /api/admin/alerts/:id
alertsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const existing = await db.alert.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'Alert not found' }, 404)
    await db.alert.delete({ where: { id } })
    return c.json({ message: 'Alert deleted' })
  } catch (error) {
    return c.json({ error: 'Failed to delete alert' }, 500)
  }
})

export { alertsRouter }


