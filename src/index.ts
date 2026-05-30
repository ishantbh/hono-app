import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { env } from './data/env.ts'
import authorRoutes from './routes/author.ts'

const app = new Hono()

app.route('/authors', authorRoutes)

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
