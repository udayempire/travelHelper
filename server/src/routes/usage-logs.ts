import { Hono } from 'hono'
import { getDb } from '../lib/db'

const usageLogsRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>()

// POST /api/admin/usage-logs
usageLogsRouter.post('/', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as {
      action: string
      metadata?: any
      userId?: string
    }
    
    if (!body.action) {
      return c.json({ error: 'Action is required' }, 400)
    }

    const db = getDb(c.env.DATABASE_URL)
    
    // Verify user exists if userId is provided
    if (body.userId) {
      const user = await db.user.findUnique({ where: { id: body.userId } })
      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }
    }

    const created = await db.usageLog.create({
      data: {
        action: body.action,
        metadata: body.metadata || null,
        userId: body.userId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    return c.json({ message: 'Usage log created successfully', log: created }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create usage log' }, 500)
  }
})

// GET /api/admin/usage-logs
usageLogsRouter.get('/', async (c) => {
  try {
    const action = c.req.query('action')
    const userId = c.req.query('userId')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
    const where: any = {}
    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }
    if (userId) {
      where.userId = userId
    }

    const db = getDb(c.env.DATABASE_URL)
    const logs = await db.usageLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Cap at 100
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    const total = await db.usageLog.count({ where })
    
    return c.json({ 
      logs, 
      pagination: { 
        total, 
        limit, 
        offset, 
        hasMore: offset + limit < total 
      } 
    })
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage logs' }, 500)
  }
})

// GET /api/admin/usage-logs/:id
usageLogsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DATABASE_URL)
    
    const log = await db.usageLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    if (!log) {
      return c.json({ error: 'Usage log not found' }, 404)
    }
    
    return c.json({ log })
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage log' }, 500)
  }
})

// GET /api/admin/usage-logs/stats/actions
usageLogsRouter.get('/stats/actions', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL)
    
    // Get action counts grouped by action type
    const actionStats = await db.usageLog.groupBy({
      by: ['action'],
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } }
    })
    
    return c.json({ actionStats })
  } catch (error) {
    return c.json({ error: 'Failed to fetch action statistics' }, 500)
  }
})

// GET /api/admin/usage-logs/stats/users
usageLogsRouter.get('/stats/users', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL)
    
    // Get usage counts per user
    const userStats = await db.usageLog.groupBy({
      by: ['userId'],
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } }
    })
    
    // Fetch user details for each userId
    const userIds = userStats.filter(stat => stat.userId).map(stat => stat.userId!)
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, role: true }
    })
    
    const userMap = new Map(users.map(user => [user.id, user]))
    
    const enrichedStats = userStats.map(stat => ({
      ...stat,
      user: stat.userId ? userMap.get(stat.userId) || null : null
    }))
    
    return c.json({ userStats: enrichedStats })
  } catch (error) {
    return c.json({ error: 'Failed to fetch user statistics' }, 500)
  }
})

// DELETE /api/admin/usage-logs/:id
usageLogsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DATABASE_URL)
    
    const existing = await db.usageLog.findUnique({ where: { id } })
    if (!existing) {
      return c.json({ error: 'Usage log not found' }, 404)
    }
    
    await db.usageLog.delete({ where: { id } })
    return c.json({ message: 'Usage log deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete usage log' }, 500)
  }
})

// DELETE /api/admin/usage-logs/cleanup/old
usageLogsRouter.delete('/cleanup/old', async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '90') // Default 90 days
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const db = getDb(c.env.DATABASE_URL)
    
    const deleted = await db.usageLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })
    
    return c.json({ 
      message: `Cleaned up ${deleted.count} usage logs older than ${days} days`,
      deletedCount: deleted.count
    })
  } catch (error) {
    return c.json({ error: 'Failed to cleanup old usage logs' }, 500)
  }
})

export { usageLogsRouter }
