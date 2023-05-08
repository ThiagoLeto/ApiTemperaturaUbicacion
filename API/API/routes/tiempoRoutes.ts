import express from "express"
import tiempoController from "../controllers/tiempoControllers"  

export const tiemposRouter = express.Router()

export function tiemposRoutes(app){
    app.get('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo', tiempoController.getTiempo);
    app.post('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo', tiempoController.addTiempo);
    app.put('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo', tiempoController.updateTiempo);
    app.patch('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo', tiempoController.changeTiempo);
    app.delete('/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo', tiempoController.deleteTiempo);
}