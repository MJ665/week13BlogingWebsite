import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
  return c.text('signupRoute!')
})
app.post('/api/v1/user/signin', (c) => {
  return c.text('signinRoute')
})
app.post('/api/v1/user/blog', (c) => {
  const id = c.req.param
  console.log (c)
  return c.text('create blog!')
})
app.put('/api/v1/user/blog', (c) => {
  return c.text('edit blog!')
})
app.get('/api/v1/user/blog/:id', (c) => {
  return c.text('get blog!')
})
app.get('/api/v1/user/blog/bulk', (c) => {
  return c.text('get blogs!')
})

export default app
