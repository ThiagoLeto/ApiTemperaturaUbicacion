
import {dbPromise,DB_CONN_STRING,DB_NAME,COLLECTION_NAME,ConvertColectionToPais,ConvertDocumentToPais,getPais,findPais,findCiudad,findProvincia,collections} from '../utilities/DataBaseFunctions/DBFunctions'
import { calcGlobalSUM,getDegrees } from '../utilities/Degrees/DegreeCalculations';
import * as mongoDB from "mongodb";
import { log } from 'console';
import { user } from '../models/user';
import * as userFunctions from '../utilities/DataBaseFunctions/userFunctions'

export default {
    userRegister: (async (_req,_res)=> {   
        const db = await userFunctions.conectUserDataBase();
        const foundUser = userFunctions.insertUser( _req.body.nombre,_req.body.psswrd)
        _res.status(200).send(foundUser);
    }),

    userLogin: (async (_req,_res)=> {   
        const db = await userFunctions.conectUserDataBase();
        const foundUser = await userFunctions.login(_req.body.nombre,_req.body.psswrd,db)
        _res.status(200).send(foundUser)
    })
}  