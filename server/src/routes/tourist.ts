import { Hono } from 'hono'
import { getDb } from '../lib/db'

const touristRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

// POST /api/admin/tourist
touristRouter.post('/', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      name: string
      phone?: string
      location?: string
      aadhaar?: string
    }
    
    if (!body.name) {
      return c.json({ error: 'Name is required' }, 400)
    }

    const db = getDb(c.env.DATABASE_URL)
    
    // Check for duplicate phone if provided
    if (body.phone) {
      const phoneExists = await db.tourist.findFirst({
        where: { phone: body.phone }
      })
      if (phoneExists) return c.json({ error: 'Phone number already exists' }, 409)
    }
    
    // Check for duplicate aadhaar if provided
    if (body.aadhaar) {
      const aadhaarExists = await db.tourist.findFirst({
        where: { aadhaar: body.aadhaar }
      })
      if (aadhaarExists) return c.json({ error: 'Aadhaar number already exists' }, 409)
    }

    const created = await db.tourist.create({
      data: {
        name: body.name,
        phone: body.phone || null,
        location: body.location || null,
        aadhaar: body.aadhaar || null,
      },
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
    
    return c.json({ message: 'Tourist created successfully', tourist: created }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create tourist' }, 500)
  }
})

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
    const includeAlerts = c.req.query('includeAlerts') === 'true'
    
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
        alerts: includeAlerts ? {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        } : false,
        _count: {
          select: {
            alerts: true
          }
        }
      },
    })
    if (!tourist) return c.json({ error: 'Tourist not found' }, 404)
    return c.json({ tourist })
  } catch (error) {
    console.error('Fetch tourist error:', error)
    return c.json({ error: 'Failed to fetch tourist' }, 500)
  }
})

// GET /api/admin/tourist/:id/alerts
touristRouter.get('/:id/alerts', async (c) => {
  try {
    const id = c.req.param('id')
    const status = c.req.query('status') as 'ACTIVE' | 'RESOLVED' | 'ONGOING' | undefined
    
    const db = getDb(c.env.DATABASE_URL)
    
    // Verify tourist exists
    const tourist = await db.tourist.findUnique({ where: { id } })
    if (!tourist) return c.json({ error: 'Tourist not found' }, 404)
    
    const where: any = { touristId: id }
    if (status && ['ACTIVE', 'RESOLVED', 'ONGOING'].includes(status)) {
      where.status = status
    }
    
    const alerts = await db.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    return c.json({ alerts })
  } catch (error) {
    console.error('Fetch tourist alerts error:', error)
    return c.json({ error: 'Failed to fetch tourist alerts' }, 500)
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


