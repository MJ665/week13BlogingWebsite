import { Hono } from 'hono'
import prisma from "./../db"


import { sign,verify } from 'hono/jwt'



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
    const jwt = await sign({id:user.id},c.env.JWT_SECRET)
    return c.json ({jwtToken:jwt})
}catch (e){
  c.status(403)
  return c.json({error:"not able to sign up"})
}

})
app.post('/api/v1/user/signin', async(c) => {
  const body = await c.req.json()
  const user = await prisma.user.findUnique({
    where:{
email: body.email
    }
  })

  if ( ! user){
    c.status(403)
    return c.json({error:"user not found"})
  }
  return c.text('signinRoute')
})



















app.use('/message/*', async (c, next) => {
  await next()
})
app.use('/api/v1/blog/*', async (c, next) => {
	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload:any = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.res.headers.set('userId', payload.id);
	await next()
})






app.post('/api/v1/blog', async (c) => {
  const userId = c.req.header('userID');


	const body = await c.req.json();
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})



app.put('/api/v1/user/blog', async  (c) => {
  const userId = c.req.header('userID');

	const body = await c.req.json();
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
})
app.get('/api/v1/user/blog/:id',async (c) => {
  const id = c.req.param('id');

	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})
app.get('/api/v1/user/blog/bulk', async(c) => {

	
	const post = await prisma.post.findMany({
		where: {}
		
	});

	return c.json(post);
})

export default app
