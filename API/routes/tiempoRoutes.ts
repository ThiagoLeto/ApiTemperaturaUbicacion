import express from "express"
import tiempoController from "../controllers/tiempoControllers"  
import { auth } from "../utilities/DataBaseFunctions/auth";


export function tiemposRoutes(app){
    app.post('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo',auth, tiempoController.addTiempo);
    app.put('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo',auth, tiempoController.updateTiempo);
    app.patch('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo', auth,tiempoController.changeTiempo);
    app.delete('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo',auth, tiempoController.deleteTiempo);
}