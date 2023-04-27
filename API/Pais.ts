import { Ciudad } from "./Ciudad";
import { Provincia } from "./Provincia";

export class Pais{
    nombre: String;
    provincias: Array<Provincia>;

    constructor(inNombre: String, inProvincias: Array<Provincia>){
        this.nombre = inNombre; this.provincias = inProvincias || new Array<Provincia>;
    }
}