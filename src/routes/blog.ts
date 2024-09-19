import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono"
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { createBlogInput, CreateBlogInput,updateBlogInput } from "harsh3314/dist";


export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    },
    Variables:{
        userId:string
    }
}>()

blogRouter.use('/*',async(c,next)=>{

  try{
    const authHeader=c.req.header("authorization") || "";

      if(!authHeader){
        c.json("not found");
      }
      else{
      const newheader=authHeader.split(' ')[1];

        console.log(newheader);

      const token=await verify(newheader,c.env.JWT_SECRET);
        console.log("first")
      if(token){
        c.set("userId",String(token.id))
        console.log("second");
        await next();
      }
      else{
        c.status(403)
        return c.json("not doungf]");
      }
      }
    }
    catch(err){
      c.status(404);
      return c.json("not found");
    }
    
})


blogRouter.post('/',async(c)=>{
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json();

    const {success}=createBlogInput.safeParse(body);

    if(success){
    const authorId=c.get("userId");
    const newblog=await prisma.blog.create({
        data:{
            content:body.content,
            title:body.title,
            authorId:Number(authorId),
            blogId:1,
            // createdAt:new Date()
        }
    })
    c.status(200)
    return c.json(newblog);
  }
  else{
    c.status(400)
    return c.json("incorrect inputs");
  }
    // await next();
  })
  
  
blogRouter.put('/',async(c)=>{
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body=await c.req.json();
const {success}=updateBlogInput.safeParse(body);

if(success){
    const authorId=c.get("userId");
    const newblog=await prisma.blog.update({
        where:{
            id:body.id,
            authorId:Number(authorId)
        },
        data:{
            content:body.content,
            title:body.title
        }
    })

    c.status(200);
    return c.json(newblog);
  }
  else{
    c.status(400)
    return c.json('incorrect inputs');
  }
        
  })
  
  
blogRouter.get('/',async(c)=>{
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    // const body=await c.req.json();
    const users=await prisma.blog.findMany({
        where:{
            authorId:Number(c.get("userId")),
        }
    });
    return c.json(users);
        
})
  

  blogRouter.get('/all',async(c)=>{
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    // const body=await c.req.json();
    const users=await prisma.blog.findMany();
    return c.json(users);
        
  })
  