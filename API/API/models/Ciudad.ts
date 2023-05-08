

import { Tiempo } from "./Tiempo";
export class Ciudad {
    nombre:String;
    registroDeTemperatura:Array<Tiempo>;

    constructor(InNombre:String,InRegistroDeTemperatura:Array<Tiempo>){ 
        this.nombre=InNombre || "";this.registroDeTemperatura=InRegistroDeTemperatura || new Array<Tiempo>;
    }



}