import express from "express"
import ciudadController from "../controllers/ciudadControllers"  
import { auth } from "../utilities/DataBaseFunctions/auth";


export function ciudadesRoutes(app){
    app.get('/paises/:pais/provincias/:provincia/ciudades/:ciudad', ciudadController.getCiudad);
    app.post('/paises/:pais/provincias/:provincia/ciudades',auth, ciudadController.addCiudad);
    app.put('/paises/:pais/provincias/:provincia/ciudades/:ciudad',auth, ciudadController.updateCiudad);
    app.patch('/paises/:pais/provincias/:provincia/ciudades/:ciudad', auth,ciudadController.changeCiudad);
    app.delete('/paises/:pais/provincias/:provincia/ciudades', auth,ciudadController.deleteCiudad);

    app.get('/temperaturaPromedio/paises/:pais/provincias/:provincia', ciudadController.getTemperaturaProvincia);
}