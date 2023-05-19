import express from "express"
import provinciaController from "../controllers/provinciaControllers"  
import { auth } from "../utilities/DataBaseFunctions/auth";


export function provinciasRoutes(app){
    app.get('/paises/:pais/provincias/:provincia', provinciaController.getProvincia);
    app.post('/paises/:pais/provincias',auth, provinciaController.addProvincia);
    app.put('/paises/:pais/provincias/:provincia',auth, provinciaController.updateProvincia);
    app.patch('/paises/:pais/provincias/:provincia',auth, provinciaController.changeProvincia);
    app.delete('/paises/provincias',auth, provinciaController.deleteProvincia);

    app.get('/temperaturaPromedio/paises/:pais/provincias/:provincia', provinciaController.getTemperaturaProvincia);
}
