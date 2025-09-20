import { Hono } from 'hono'
import { adminRouter } from './routes/admin'
import { touristRouter } from './routes/tourist'
import { alertsRouter } from './routes/alerts'
import { statsRouter } from './routes/stats'
import { usersRouter } from './routes/users'
import { usageLogsRouter } from './routes/usage-logs'

const app = new Hono<{ Bindings: { DATABASE_URL: string } }>()

type Bindings = {
  DATABASE_URL: string
}


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/admin', adminRouter)
app.route('/api/admin/tourist', touristRouter)
app.route('/api/admin/alerts', alertsRouter)
app.route('/api/admin/stats', statsRouter)
app.route('/api/admin/users', usersRouter)
app.route('/api/admin/usage-logs', usageLogsRouter)

export default app
