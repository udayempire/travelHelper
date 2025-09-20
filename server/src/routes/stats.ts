import { Hono } from 'hono'
import { getDb } from '../lib/db'

const statsRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

// GET /api/admin/stats/tourists
statsRouter.get('/tourists', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL)
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
    const db = getDb(c.env.DATABASE_URL)
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
    const limit = parseInt(c.req.query('limit') || '200')
    const db = getDb(c.env.DATABASE_URL)
    const logs = await db.usageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500), // Cap at 500
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return c.json({ logs })
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage logs' }, 500)
  }
})

// GET /api/admin/stats/overview
statsRouter.get('/overview', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL)
    
    // Get all counts in parallel
    const [
      totalUsers,
      totalTourists,
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      ongoingAlerts,
      totalUsageLogs
    ] = await Promise.all([
      db.user.count(),
      db.tourist.count(),
      db.alert.count(),
      db.alert.count({ where: { status: 'ACTIVE' } as any }),
      db.alert.count({ where: { status: 'RESOLVED' } as any }),
      db.alert.count({ where: { status: 'ONGOING' } as any }),
      db.usageLog.count()
    ])
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivity = await Promise.all([
      db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.tourist.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.alert.count({ where: { createdAt: { gte: sevenDaysAgo } } })
    ])
    
    return c.json({
      overview: {
        users: {
          total: totalUsers,
          recent: recentActivity[0]
        },
        tourists: {
          total: totalTourists,
          recent: recentActivity[1]
        },
        alerts: {
          total: totalAlerts,
          active: activeAlerts,
          resolved: resolvedAlerts,
          ongoing: ongoingAlerts,
          recent: recentActivity[2]
        },
        usageLogs: {
          total: totalUsageLogs
        }
      }
    })
  } catch (error) {
    return c.json({ error: 'Failed to fetch overview statistics' }, 500)
  }
})

// GET /api/admin/stats/users
statsRouter.get('/users', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL)
    const userStats = await db.user.groupBy({
      by: ['role'],
      _count: { _all: true }
    })
    
    const roleStats = userStats.reduce((acc, stat) => {
      acc[stat.role.toLowerCase()] = stat._count._all
      return acc
    }, {} as Record<string, number>)
    
    return c.json({ roleStats })
  } catch (error) {
    return c.json({ error: 'Failed to compute user statistics' }, 500)
  }
})

export { statsRouter }


