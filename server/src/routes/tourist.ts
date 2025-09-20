import { Hono } from 'hono'
import { getDb } from '../lib/db'

const touristRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

// GET /api/admin/tourist?search=&location=
touristRouter.get('/', async (c) => {
  try {
    const search = c.req.query('search')
    const location = c.req.query('location')

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { aadhaar: { contains: search } },
      ]
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    const db = getDb(c.env.DATABASE_URL)
    const tourists = await db.tourist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        location: true,
        aadhaar: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return c.json({ tourists })
  } catch (error) {
    return c.json({ error: 'Failed to fetch tourists' }, 500)
  }
})

// GET /api/admin/tourist/:id
touristRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DATABASE_URL)
    const tourist = await db.tourist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        location: true,
        aadhaar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!tourist) return c.json({ error: 'Tourist not found' }, 404)
    return c.json({ tourist })
  } catch (error) {
    return c.json({ error: 'Failed to fetch tourist' }, 500)
  }
})

// PUT /api/admin/tourist/:id
touristRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = (await c.req.json().catch(() => ({}))) as {
      name?: string
      phone?: string
      location?: string
      aadhaar?: string
    }

    const db = getDb(c.env.DATABASE_URL)
    const existing = await db.tourist.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'Tourist not found' }, 404)

    if (body.phone) {
      const phoneExists = await db.tourist.findFirst({
        where: { phone: body.phone, id: { not: id } },
      })
      if (phoneExists) return c.json({ error: 'Phone already exists' }, 409)
    }
    if (body.aadhaar) {
      const aadhaarExists = await db.tourist.findFirst({
        where: { aadhaar: body.aadhaar, id: { not: id } },
      })
      if (aadhaarExists) return c.json({ error: 'Aadhaar already exists' }, 409)
    }

    const updated = await db.tourist.update({
      where: { id },
      data: body,
      select: {
        id: true,
        name: true,
        phone: true,
        location: true,
        aadhaar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return c.json({ message: 'Tourist updated', tourist: updated })
  } catch (error) {
    return c.json({ error: 'Failed to update tourist' }, 500)
  }
})

// DELETE /api/admin/tourist/:id
touristRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DATABASE_URL)
    const existing = await db.tourist.findUnique({ where: { id } })
    if (!existing) return c.json({ error: 'Tourist not found' }, 404)
    await db.tourist.delete({ where: { id } })
    return c.json({ message: 'Tourist deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete tourist' }, 500)
  }
})

export { touristRouter }


