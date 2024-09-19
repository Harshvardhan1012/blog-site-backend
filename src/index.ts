import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogRouter } from './routes/blog';
import { userRouter } from './routes/userroutes';
// import { authMiddleware } from './middleware';
import { cors } from 'hono/cors';

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>();

app.use(cors());
app.route('/api/v1',userRouter);
app.route('/api/v1/blog',blogRouter);


// const url=
// app.get('/api/v1/*', async(c,next) => {
//   const header=c.req.header("authorization");

//   if(!header){
//     c.json("not found");
//   }
//   else{
//   const newheader=header.split(' ')[1];
//   const token=await verify(newheader,c.env.JWT_SECRET);
//   if(token.id){
//     c.set('userId',token.id)
//     await next();
//   }
//   else{
//     c.status(403)
//     return c.json("not doungf]");
//   }
//   }


//   // return c.text('Hello Hono!')
// })





export default app
