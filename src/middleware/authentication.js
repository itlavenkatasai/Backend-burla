import Jwt from 'jsonwebtoken';
export const checkAndVerify = async (req,res,next) => {
    const {authorization} = req.headers;
    try{
        if(!authorization){
            return res.status(400).json({
                message : "authorization token missing"
            })
        }
        const authorizationData = authorization.split(" ");
        if(authorizationData.length != 2){
            return res.status(400).json({
                message : "Invalid Token Format"
            })
        }
        const [format,token] = authorizationData;
        if(format  != 'Bearer'){
            return res.status(400).json({
                message : "Invalid Token Format"
            })
        }
        const {TOKEN_SECRET} = process.env;
        const payLoad = Jwt.verify(token,TOKEN_SECRET);
        const {phoneNumber,clientId} = payLoad;
        req.locals = {
            phoneNumber,
            clientId
        }
        // console.log("payload",payLoad);
        return next();
    }catch(error){
        console.log(error.message);
        const errorMessage = error.message;
        if (errorMessage == "jwt expired") {
            return res.status(500).json({
                message: "jwt token is expired ,please login again. "
            });
        };
        if (errorMessage == "invalid signature") {
            console.log(errorMessage);
            return res.status(500).json({
                message: "wrong token is given"
            });
        };
        return res.status(500).json({
            message : "failed to verify token"
        })
    }

}