import {dbPromise,DB_CONN_STRING,DB_NAME,COLLECTION_NAME,ConvertColectionToPais,ConvertDocumentToPais,getPais,findPais,findCiudad,findProvincia,collections} from '../utilities/DataBaseFunctions/DBFunctions'
import { Pais } from '../models/Pais';
import { Provincia } from '../models/Provincia';
import { Ciudad } from '../models/Ciudad';
import { Tiempo } from '../models/Tiempo';


export default{

    addTiempo: (async (_req,_res)=> {
        const tiempo  = _req.body as Tiempo
        const pais = await getPais( _req.params.pais )
        const provincia = pais.provincias.find( (prov)=> prov.nombre ===_req.params.provincia )
        const ciudad = provincia?.ciudades.find( (c)=> c.nombre===_req.params.ciudad )
        if(!ciudad || !provincia) { return _res.status(400).send(null) }
        const provPos = pais.provincias.indexOf( provincia )
        const ciudadPos = provincia.ciudades.indexOf(ciudad)
        if( !ciudad.registroDeTemperatura ) { return _res.sendStatus(400)}
        pais.provincias[provPos].ciudades[ciudadPos].registroDeTemperatura.push(tiempo)
        collections.paises?.findOneAndReplace( {nombre: pais.nombre},pais )
        _res.send(pais)  
    }),

    updateTiempo: (async (_req,_res)=> {
        const tiempo = _req.body as Tiempo
        const pais = await getPais(_req.params.pais)
        const provincia = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
        const ciudad = provincia?.ciudades.find( (x)=>x.nombre===_req.params.ciudad )
        if(!ciudad || ciudad===undefined){ return _res.sendStatus(400) }
        const tiempoAux = ciudad?.registroDeTemperatura.find( (x)=>String(x.fecha)===_req.params.tiempo )
        const tiempoPos=ciudad?.registroDeTemperatura.indexOf( tiempoAux!)
        pais.provincias[ pais.provincias.indexOf( provincia! ) ].ciudades[provincia!.ciudades.indexOf(ciudad)].registroDeTemperatura[tiempoPos]=tiempo
        const respuesta = await collections.paises?.findOneAndReplace( {nombre: _req.params.pais },pais )
        _res.status(200).send(respuesta)
    }),

    changeTiempo: (async (_req,_res)=> {
        try {
            const tiempo = _req.body as Tiempo
            const pais = await getPais( _req.params.pais )
            const provincia = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
            const ciudad = provincia!.ciudades.find( (x)=>x.nombre===_req.params.ciudad )
            const tiempoOriginal = ciudad!.registroDeTemperatura.find( (x)=>String(x.fecha)! ===_req.params.fecha )
            const tiempoPos = pais.provincias[pais.provincias.indexOf(provincia!)].ciudades[provincia!.ciudades.indexOf( ciudad! )].registroDeTemperatura.indexOf(tiempoOriginal!)
            const ciudadPos = pais.provincias[pais.provincias.indexOf(provincia!)].ciudades.indexOf(ciudad!)
        
            if( tiempo.fecha ){ tiempoOriginal!.fecha= tiempo!.fecha }
            if (tiempo.grados){ tiempoOriginal!.grados=tiempo!.grados }
            pais.provincias[ pais.provincias.indexOf( provincia! ) ].ciudades[ciudadPos].registroDeTemperatura[tiempoPos]=tiempoOriginal!
            collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais!)
            return _res.status(200).send("mando may guey")
        } catch (error) {
            _res.status(400).send("el que dice error es puto");
        }
    }),

    deleteTiempo: (async (_req,_res)=> {
        try {
            const tiempo = _req.body as Tiempo
            const pais      = await getPais( _req.params.pais )
            const provincia   = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
            const ciudad = provincia?.ciudades.find( (x)=>x.nombre===_req.params.ciudad )
            const tiempoAux = ciudad?.registroDeTemperatura.find((x)=>x.fecha===tiempo.fecha)
            const tiempoPos = ciudad?.registroDeTemperatura.indexOf(tiempoAux!)
            pais.provincias[pais.provincias.indexOf(provincia!)].ciudades[provincia!.ciudades.indexOf(ciudad!)].registroDeTemperatura.splice( tiempoPos!,1 )
            collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
            return _res.status(200).send("mando may guey")
        } catch (error) {
            _res.status(400).send("el que dice error es puto");
        }
    })
}
