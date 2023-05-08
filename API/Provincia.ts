import { Ciudad } from "./Ciudad";
import { Tiempo } from "./Tiempo";

export class Provincia{
    nombre: String;
    ciudades: Array<Ciudad>;
    
    constructor(inNombre: String, inCiudades: Array<Ciudad> ){
        this.nombre = inNombre; this.ciudades = inCiudades || new Array<Ciudad>;
    }

}
