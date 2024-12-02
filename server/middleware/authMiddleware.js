import jwt from "jsonwebtoken"
import User from "../models/user.js"
const protectRoute = async(req,res,next)=>{
    try{
        let token = req.cookies?.token
        if(token){
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
            const resp = await User.findById(decodedToken.userId).select("isAdmin email isSup")
            req.user = {
                email: resp.email,
                isAdmin: resp.isAdmin,
                isSup:resp.isSup,
                userId: decodedToken.userId
            }
            next()
        }else{
          return res.status(401).json({status:false, message:"Not Authorized Try Login Again"})
        }
        

    }catch(error){
        console.log(error)
        return res.status(401).json({status:false, message:"Not Authorized Try Login Again"})
    }

}

const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Not authorized as admin. Try login as admin.",
      });
    }
  };
  const isSupRoute = (req, res, next) => {
    if (req.user && req.user.isSup) {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Not authorized as admin. Try login as admin.",
      });
    }
  };

export { isAdminRoute,isSupRoute, protectRoute };