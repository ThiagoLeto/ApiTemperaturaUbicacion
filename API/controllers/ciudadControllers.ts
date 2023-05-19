import {dbPromise,DB_CONN_STRING,DB_NAME,COLLECTION_NAME,ConvertColectionToPais,ConvertDocumentToPais,getPais,findPais,findCiudad,findProvincia,collections} from '../utilities/DataBaseFunctions/DBFunctions'
import { Pais } from '../models/Pais';
import { Provincia } from '../models/Provincia';
import { Ciudad } from '../models/Ciudad';


export default{
    getCiudad: (async (_req,_res)=> {
        const paises  = await ConvertColectionToPais(await dbPromise)
        const pais    = await findPais(paises,_req.params.pais)
        if(!pais){return _res.sendStatus(400)}
        const provincia = await findProvincia( pais,_req.params.provincia )
        if(provincia) return _res.status(200).send( await findCiudad( provincia,_req.params.ciudad ) )
        return _res.sendStatus(400)
    }),

    addCiudad: (async (_req,_res)=> {
        const ciudad  = _req.body as Ciudad
        const pais = await getPais( _req.params.pais )
        const provincia = pais.provincias.find( (prov)=> prov.nombre ===_req.params.provincia )
        provincia?.ciudades.push( ciudad )
        const respuesta = await collections.paises?.findOneAndReplace( { nombre: _req.params.pais } , pais )
        return _res.status(200).send( respuesta )
    }),

    updateCiudad: (async (_req,_res)=> {
        const ciudad = _req.body as Ciudad
        const pais = await getPais(_req.params.pais)
        const provincia = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
        if(!provincia){return _res.status(400).send("no") }
        const ciudadPos = provincia!.ciudades.indexOf( (provincia!.ciudades.find( (x)=> x.nombre ===_req.params.ciudad)! ))
        pais.provincias[ pais.provincias.indexOf( provincia! ) ].ciudades[ ciudadPos ]=ciudad
        const respuesta = await collections.paises?.findOneAndReplace( {nombre: _req.params.pais },pais )
        _res.status(200).send(respuesta)
    }),

    changeCiudad: (async (_req,_res)=> {
        try {
            const ciudad = _req.body as Ciudad
            const pais = await getPais( _req.params.pais )
            const provincia = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
            const ciudadOriginal = provincia!.ciudades.find( (x)=>x.nombre===_req.params.ciudad )
            const ciudadPos = pais.provincias[pais.provincias.indexOf(provincia!)].ciudades.indexOf(ciudadOriginal!)
            if( ciudad.nombre ){ ciudadOriginal!.nombre= ciudad!.nombre }
            if (ciudad.registroDeTemperatura){ ciudadOriginal!.registroDeTemperatura=ciudad!.registroDeTemperatura }
            pais.provincias[ pais.provincias.indexOf( provincia! ) ].ciudades[ciudadPos] =  ciudadOriginal!
            collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais!)
            return _res.status(200).send("mando may guey")
        } catch (error) {
            _res.status(400).send("el que dice error es puto");
        }
    }),

    deleteCiudad: (async (_req,_res)=> {
        try {
            const ciudad = _req.body as Ciudad
            const pais      = await getPais( _req.params.pais )
            const provincia   = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
            const ciudadAux = provincia?.ciudades.find( (x)=>x.nombre===ciudad.nombre )
            const ciudadPos = provincia?.ciudades.indexOf(ciudadAux!)
            pais.provincias[pais.provincias.indexOf(provincia!)].ciudades.splice( ciudadPos!,1 )
            collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
            return _res.status(200).send("mando may guey")
        } catch (error) {
            _res.status(400).send("el que dice error es puto");
        }
    }),

    getTemperaturaProvincia: (async (_req,_res)=> {
        if (!_req.params.pais) {
            return _res.status(400).send("te falto el pais capo")
          }
          if (!_req.params.provincia) {
            return _res.status(400).send("te falto provincia capo")
          }
          let grados:Array<Number> = new Array<Number>  
           const pais = await getPais( _req.params.pais )
           if(!pais){return _res.status(400).send("nope")}
          const x = pais.provincias.find( (pa)=> pa.nombre===_req.params.provincia )
          if(!x) { return _res.status(400).send("snickers?")}
          x.ciudades.forEach( (city)=> { city.registroDeTemperatura.forEach( (regs)=>{ grados.push(regs.grados) } ) } )
          let promedio:Number = new Number; 
          grados.forEach( (celsius)=> { if(!promedio){promedio=celsius.valueOf()}else{promedio=promedio.valueOf()+celsius.valueOf() }  }  )
          if(promedio) { return _res.json({ "promedio" : promedio.valueOf()/grados.length}) }
          return _res.sendStatus(400)
    })
}
