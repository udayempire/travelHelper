import { Hono } from 'hono'
import db from '../lib/db'

const statsRouter = new Hono()

// GET /api/admin/stats/tourists
statsRouter.get('/tourists', async (c) => {
  try {
    const total = await db.tourist.count()
    const byLocationRaw = await db.tourist.groupBy({
      by: ['location'],
      _count: { _all: true },
    })
    const byLocation = byLocationRaw
      .filter((row: any) => row.location)
      .map((row: any) => ({ location: row.location, count: row._count._all }))

    // Active tourists could be defined differently; placeholder equals total
    const active = total

    return c.json({ total, active, byLocation })
  } catch (error) {
    return c.json({ error: 'Failed to compute tourist stats' }, 500)
  }
})

// GET /api/admin/stats/alerts
statsRouter.get('/alerts', async (c) => {
  try {
    const active = await db.alert.count({ where: { status: 'ACTIVE' } as any })
    const resolved = await db.alert.count({ where: { status: 'RESOLVED' } as any })
    const ongoing = await db.alert.count({ where: { status: 'ONGOING' } as any })
    return c.json({ active, resolved, ongoing })
  } catch (error) {
    return c.json({ error: 'Failed to compute alert stats' }, 500)
  }
})

// GET /api/admin/stats/usage
statsRouter.get('/usage', async (c) => {
  try {
    const logs = await db.usageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return c.json({ logs })
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage logs' }, 500)
  }
})

export { statsRouter }


