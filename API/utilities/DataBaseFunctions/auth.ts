import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import {Request,Response,NextFunction} from "express"
import {loginToken,conectUserDataBase, confirm as confirmUser} from "./userFunctions"
import { user } from "../../models/user";
import { hash } from "bcryptjs";


export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }
   
   export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = await conectUserDataBase();
      const token = req.body.Auth.token
      const decoded= jwt.verify(req.body.Auth.token,"cambiarPorUnaVariable");
      //const objeto = new user(decoded.name,decoded.hash.hash,decoded.hash.salt);
      (req as CustomRequest).token = decoded;
      if(typeof(decoded)=="string"){ throw new Error() }
      let hashCompared = await confirmUser(decoded.name,db)
      hashCompared = hashCompared.hash
      console.log("originaL: "+hashCompared)
      console.log("el otro: "+decoded.hash.hash)      
      if(String(decoded.hash.hash )!= String(hashCompared)){throw new Error()}
      console.log(decoded.name);

      console.log("loggeando token: "+token )

      //const decoded = jwt.verify(token, "cambiarPorUnaVariable");
      //(req as CustomRequest).token = decoded;
   
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
   };
   