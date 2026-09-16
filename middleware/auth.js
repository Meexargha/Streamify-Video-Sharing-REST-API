import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"No token provided"});
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = { ...decoded, _id: decoded._id };
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}  


export default authMiddleware;