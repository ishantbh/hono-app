import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { env } from './data/env.ts'
import apiKeyRoutes from './routes/apiKey.ts'
import authRoutes from './routes/auth.ts'
import authorRoutes from './routes/author.ts'
import bookRoutes from './routes/book.ts'

const app = new Hono()

app.route('/api-key', apiKeyRoutes)
app.route('/auth', authRoutes)
app.route('/authors', authorRoutes)
app.route('/books', bookRoutes)

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
