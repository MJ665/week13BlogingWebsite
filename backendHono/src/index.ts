import { Hono } from 'hono'
import prisma from "./../db"


import { sign } from 'hono/jwt'

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();
app.post('/api/v1/user/signup',async (c) => {
const body = await c.req.json ()
try {
  const user = await prisma.user.create({
    data:{
      email:body.email,
      password:body.password
    }
    })
  return c.text('signupRoute! Returing JWt here')
  const jwt = await sign({id:user.id},c.env.JWT_SECRET)
}catch (e){
  return c.status(403)
}

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
