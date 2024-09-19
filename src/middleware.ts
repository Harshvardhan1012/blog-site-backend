import { verify } from "hono/jwt";

export const authMiddleware=async(c:any)=>{
    const token=c.req.headers["Authorization"];
console.log(token);
    if(!token){
        c.json("error");
    }
        const newtoken=token.split(' ')[1];
    const authverify=await verify(newtoken,"HARSH");

    if(authverify){
        c.json("verfied");
        c.next();
    }

}