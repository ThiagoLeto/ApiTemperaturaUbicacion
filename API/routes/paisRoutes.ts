import express from "express"
import paisController from "../controllers/paisControllers"  
import { auth } from "../utilities/DataBaseFunctions/auth";

//export const paisesRouter = express()

export function paisRoutes(app){
    app.get('/paises', auth,paisController.getPaises);
    app.get('/paises/:pais', paisController.getPais);
    app.post('/paises',auth, paisController.addPais);
    app.put('/paises/:pais',auth, paisController.updatePais);
    app.patch('/paises/:pais',auth, paisController.changePais);
    app.delete('/paises', auth,paisController.deletePais);
    
    app.get('/temperaturaPromedio/paises', paisController.getTemperaturaGlobal);
    app.get('/temperaturaPromedio/paises/:pais', paisController.getTemperaturaPais);
}