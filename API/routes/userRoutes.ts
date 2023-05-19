import express from "express"
import userController from "../controllers/userControllers"  

export function UserRoutes(app){
    app.post('/register', userController.userRegister);
    app.post('/login', userController.userLogin);
}