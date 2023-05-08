import express from "express"
import paisController from "../controllers/paisControllers"  

//export const paisesRouter = express()

export function paisRoutes(app){
    app.get('/paises', paisController.getPaises);
    app.get('/paises/:pais', paisController.getPais);
    app.post('/paises', paisController.addPais);
    app.put('/paises/:pais', paisController.updatePais);
    app.patch('/paises/:pais', paisController.changePais);
    app.delete('/paises', paisController.deletePais);
    
    app.get('/temperaturaPromedio/paises', paisController.getTemperaturaGlobal);
    app.get('/temperaturaPromedio/paises/:pais', paisController.getTemperaturaPais);
}