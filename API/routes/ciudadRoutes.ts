import express from "express"
import ciudadController from "../controllers/ciudadControllers"  

export const ciudadesRouter = express.Router()

export function ciudadesRoutes(app){
    app.get('/paises/:pais/provincias/:provincia/ciudades/:ciudad', ciudadController.getCiudad);
    app.get('/paises/:pais/provincias/:provincia/ciudades', ciudadController.addCiudad);
    app.put('/paises/:pais/provincias/:provincia/ciudades/:ciudad', ciudadController.updateCiudad);
    app.patch('/paises/:pais/provincias/:provincia/ciudades/:ciudad', ciudadController.changeCiudad);
    app.delete('/paises/:pais/provincias/:provincia/ciudades', ciudadController.deleteCiudad);
}