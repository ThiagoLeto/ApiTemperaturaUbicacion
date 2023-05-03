import express from "express"
import paisController from "../controllers/paisControllers"  

export const paisesRouter = express.Router()


paisesRouter.get('/paises', paisController.getPaises);
paisesRouter.get('/paises/:pais', paisController.getPais);
paisesRouter.put('/paises/:pais', paisController.updatePais);
paisesRouter.patch('/paises/:pais', paisController.changePais);
paisesRouter.delete('/paises', paisController.deletePais);
