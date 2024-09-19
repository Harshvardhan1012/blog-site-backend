import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import express from 'express';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import {signupInput,signinInput} from "harsh3314/dist/index.js"

export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    }
}>


userRouter.post('/signup',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body=await c.req.json();
    console.log(body);
const {success}=signupInput.safeParse(body);
console.log(success);
if(success){
  console.log(body);
  
    const user=await prisma.user.create({
      data:{
        username:body.username,
        password:body.password,
        name:body.name
      }
    })
    console.log(user,"dfffsf");
  
    const token=await sign({id:user.id},c.env.JWT_SECRET);
  
    return c.json({user,token});
  }
  else{
    // c.json("incorrect inputs");
    c.status(400);
    return c.json("incorrect inputs")
  }
})
  
  
  // const url=

  
  
  
userRouter.post('/signin',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body=await c.req.json();
    const {success}=signinInput.safeParse(body);
    console.log(success);
    if(success){
    const users=await prisma.user.findUnique({
      where:{
        username:body.username,
        password:body.password
      }
    })
      if(!users){
        c.json("user not found");
      }
    
      if(users){
      const token=await sign({id:users.id},c.env.JWT_SECRET);
      return c.json({users,token});
      }
    
    }
      else{
        c.json("incorrect inputs");
    }
  
  
    // return c.text("nre")
        
  })