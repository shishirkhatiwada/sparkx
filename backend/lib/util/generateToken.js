import jwt from "jsonwebtoken"
 const generateTokenAndSetCookie  =  (userId, res)=>{

 const token =  jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn:'15d'

})

res.cookie('accessToken', token, {
    httpOnly: true, //this saves site from xss
    maxAge: 15*24*60*60*1000, //miliseconds 
    sameSite: "strict",
    secure: process.env.NODE_ENV != "development"
})

}

export default generateTokenAndSetCookie