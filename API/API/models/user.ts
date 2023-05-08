export class user{
    nombre:string;
    hash:string;
    salt:string;

    constructor(InNombre:string,InHash:string,salt:string){ 
        this.nombre=InNombre ; this.hash = InHash ; this.salt = salt;
    }
}