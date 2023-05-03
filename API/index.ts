import { paisesRouter } from './routes/paisRoutes';
//import { provinciasRouter } from './routes/paisRoutes';
//import { ciudadesRouter } from './routes/paisRoutes';
//import { tiemporsRouter } from './routes/paisRoutes';

import { ObjectId } from 'mongodb';
import * as mongoDB from "mongodb";
import { Ciudad } from './Ciudad';
import { Pais } from './Pais';
import { Provincia } from './Provincia';
import { Tiempo } from './Tiempo';
import express, { json } from 'express';
import swaggerDocs from './swagger';

const DB_CONN_STRING="mongodb://localhost:27017"
const DB_NAME="BaseDeTemperaturas"
const COLLECTION_NAME="paises"

const app = express();

const port = 3000


app.use(express.json());


const collections: { paises?: mongoDB.Collection } = {}
async function findPais(paises:Pais[],target:string) {
 return paises.find( (pais)=> pais.nombre.toLowerCase() === target.toLocaleLowerCase() )
}
async function ConvertColectionToPais(db:mongoDB.Db): Promise<Pais[]> {
  const col = await db.collection("paises").find().toArray();
  let paises:Pais[]=[]
  col.forEach( (obj)=>{ const pais:Pais = new Pais(obj.nombre,obj.provincias);paises.push(pais) } )
  return paises
}

async function ConvertDocumentToPais(document:mongoDB.WithId<mongoDB.BSON.Document>) :Promise<Pais>{
  let pais:Pais = new Pais( document.nombre,document.provincias )
  return pais
}
async function getPais(target:string ) {
  const doc = await collections.paises?.findOne( {nombre: target} )
  let pais = ConvertDocumentToPais(doc!)  
  return pais
}

async function findCiudad(provincia:Provincia,target:string) {
  return provincia.ciudades.find( (ciudad)=> ciudad.nombre.toLowerCase()===target.toLowerCase() )
}

async function findProvincia(pais:Pais,target:string) {
  return pais.provincias.find( ( provincia ) => provincia.nombre.toLowerCase()===target.toLowerCase() )  
}


async function main() {

  async function connectToDatabase () {
    // dotenv.config();
  
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
            
    await client.connect();
    
    const db: mongoDB.Db = client.db(DB_NAME);
    const paisesCollection: mongoDB.Collection = db.collection(COLLECTION_NAME);
    collections.paises = paisesCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${paisesCollection.collectionName}`);
    return db;
  }

  const db: mongoDB.Db = await connectToDatabase()
  app.get( '/paises', async (_req,_res)=> 
    { _res.status(200).send(await ConvertColectionToPais(db)) }
  )




  app.patch( '/paises/:pais/', async (_req,_res)=> {
    try {
      const pais = _req.body as Pais
      const paisOriginal = await getPais( _req.params.pais )
      
      if( pais.nombre ){ paisOriginal.nombre= pais.nombre }
      if (pais.provincias){ paisOriginal.provincias=pais.provincias }

      collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , paisOriginal)
      return _res.status(200).send("mando may guey")
  } catch (error) {
      _res.status(400).send("el que dice error es puto");
  }
  })

  async function calcGlobalSUM(grados:Array<number>)  {
    if(grados.length<=0){return false}
    let promedio:number  ; 
    grados.forEach( (celsius)=> { if(!promedio){promedio=celsius.valueOf()}else{promedio=promedio.valueOf()+celsius.valueOf() }  }  )
    return promedio!
  }
  async function getDegrees( ) {
    
    let grados:Array<number> = new Array<number>  
    let paises = await ConvertColectionToPais(db)
    console.log(paises);
    
   paises.forEach( (pais)=> { pais.provincias.forEach((provincia)=>{ console.log(provincia);
   ;provincia.ciudades.forEach( (ciudad)=>{console.log(ciudad);
    ciudad.registroDeTemperatura.forEach( (x)=>{ console.log(grados.push(x.grados));console.log( grados );return grados;
    }) })  })})
    return grados
  }
     
  app.get( '/temperaturaPromedio/', async (_req,_res) => {
    const grados = await getDegrees()
    console.log(grados);
    
    const promedio = await calcGlobalSUM( grados )
    if(promedio) { return _res.json({ "promedio" : promedio.valueOf()/grados.length}) }return _res.sendStatus(400)
  })
     


//function findnombre(nombre:string,object:object){ const p = paises.find((pa) => pa.nombre.toLowerCase() === nombre) }

let ciudades:Array<Ciudad> = new Array<Ciudad>
let gciudad= new Ciudad("CABA", [  (new Tiempo( new Date() , 30) ), (new Tiempo( new Date() , 32) ),(new Tiempo(new Date(),36) ) ] )

ciudades.push(gciudad )
gciudad= new Ciudad("Pueyrredon", [  (new Tiempo( new Date() , 10) ), (new Tiempo( new Date() , 20) ),(new Tiempo(new Date(),16) ) ] )
ciudades.push(gciudad )

let provins = new Array<Provincia>
let genprovincia = new Provincia("BSAS",ciudades)
provins.push(genprovincia)

ciudades = new Array<Ciudad>
gciudad= new Ciudad("CiudadDeCordoba", [  (new Tiempo( new Date() , 10) ), (new Tiempo( new Date() , 20) ),(new Tiempo(new Date(),16) ) ] )
ciudades = new Array<Ciudad>
gciudad= new Ciudad("Cosquin", [  (new Tiempo( new Date() , 10) ), (new Tiempo( new Date() , 20) ),(new Tiempo(new Date(),16) ) ] )
ciudades.push(gciudad)
genprovincia = new Provincia("Cordoba",ciudades)
provins.push(genprovincia)
let paises = new Array<Pais>
paises.push(new Pais("Argentina",provins))



app.put("/paises/:pais", async (_req, _res) => {
  try {
      const pais = _req.body as Pais
      collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
      return _res.status(200).send("mando may guey")
  } catch (error) {
      _res.status(400).send("el que dice error es puto");
  }
});

app.put( '/paises/:pais/provincias/:provincia', async (_req,_res)=> {
  const provincia = _req.body as Provincia
  const pais = await getPais(_req.params.pais)
  const provAux= pais.provincias.find( (p)=>p.nombre=== _req.params.provincia )
  if(!provAux){ return _res.sendStatus(400) }
  const provPos = pais.provincias.indexOf( provAux )
  pais.provincias[provPos]=provincia
  collections.paises?.findOneAndReplace( {nombre: _req.params.pais},pais )
  _res.status(200).send("papapepo!")
})

 


app.put( '/paises/:pais/provincias/:provincia/ciudades/:ciudad/tiempo/:tiempo', async(_req,_res)=> {
  
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
  //const tiempoaux = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )?.ciudades.find( (x)=>x.nombre===_req.params.ciudad )?.registroDeTemperatura.find( (x)=>String(x.fecha)=== _req.params.tiempo)  } )
/*
  pais.provincias[provPos]=provincia
  collections.paises?.findOneAndReplace( {nombre: _req.params.pais},pais )
  _res.status(200).send("papapepo!")
  */
})

 

app.put( '/paises/:pais/provincias/:provincia/ciudades/:ciudad', async(_req,_res)=> {
  const ciudad = _req.body as Ciudad
  const pais = await getPais(_req.params.pais)
  const provincia = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
  if(!provincia){return _res.status(400).send("no") }
  const ciudadPos = provincia!.ciudades.indexOf( (provincia!.ciudades.find( (x)=> x.nombre ===_req.params.ciudad)! ))
  pais.provincias[ pais.provincias.indexOf( provincia! ) ].ciudades[ ciudadPos ]=ciudad
  const respuesta = await collections.paises?.findOneAndReplace( {nombre: _req.params.pais },pais )
  _res.status(200).send(respuesta)
})



 
app.patch( '/paises/:pais/provincias/:provincia', async(_req,_res)=> {
  try {
    const provincia = _req.body as Provincia
    const pais = await getPais( _req.params.pais )
    const provinciaOriginal = pais.provincias.find( (x)=>x.nombre===_req.params.provincia )
    const provPos = pais.provincias.indexOf( provinciaOriginal! )
    if( provincia.nombre ){ provinciaOriginal!.nombre= provincia.nombre }
    if (provincia.ciudades){ provinciaOriginal!.ciudades=provincia.ciudades }
    pais.provincias[provPos]=provinciaOriginal!
    collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
    return _res.status(200).send("mando may guey")
} catch (error) {
    _res.status(400).send("el que dice error es puto");
}
})

 

 

app.patch( '/paises/:pais/provincias/:provincia/ciudades/:ciudad', async(_req,_res)=> {
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
})


 


app.patch( '/paises/:pais/provincias/:provincia/ciudades/:ciudad/fechas/:fecha', async(_req,_res)=> {
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
})

app.get('/', (_req , _res) => _res.send('Bienvenido a mi API REST!'));



app.delete("/paises", async (_req, _res) => {
  try {
    const r = await collections.paises?.deleteOne( { nombre: _req.body.nombre } );

    if (r && r.deletedCount) {
      _res.status(202).send(`Se fue a cagar! yei `);
    } else if (!r) {
      _res.status(400).send(`No!!!`);
    } else if (!r.deletedCount) {
      _res.status(404).send(` no existe geniopfsjmerg`);
    }
  } catch (error) {
      _res.status(400).send("error");
  }
});

 

 app.delete( '/paises/:pais/provincias', async(_req,_res)=> {
  try {
    const provincia = _req.body as Provincia
    const pais      = await getPais( _req.params.pais )
    const provAux   = pais.provincias.find( (x)=>x.nombre===pais.nombre )
    const provPos = pais.provincias.indexOf(provAux!)
    pais.provincias.splice( provPos,1 )
    collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
    return _res.status(200).send("mando may guey")
} catch (error) {
    _res.status(400).send("el que dice error es puto");
}
})

 

app.delete( '/paises/:pais/provincias/:provincia/ciudades', async(_req,_res)=> {
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
})
 
app.delete( '/paises/:pais/provincias/:provincia/ciudades/:ciudad/fechas', async(_req,_res)=> {
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
   }

)





function PaisByName(nombre: String) {
    return paises.find( item => { return item.nombre== nombre} );    
}

 app.get( '/paises/:pais', async(_req,_res)=> {
  const pais = getPais(_req.params.pais)
  _res.status(200).send(pais)   
     }
 )

 

app.get('/paises/:pais/provincias/:provincia', async (_req,_res)=> 
{  
  const paises  = await ConvertColectionToPais(db)
  const pais    = await findPais(paises,_req.params.pais)
  if (!pais){ return _res.sendStatus(400) }
   _res.status(200).send( await findProvincia( pais,_req.params.provincia ) )
   /*
    if( !_req.params.pais || !_req.params.provincia){  return _res.status(400).send("pogichamps")}
    const element = PaisByName(_req.params.pais);
    if(!element){return _res.sendStatus(400)}
    console.log(element, element?.getProvincia(_req.params.provincia));
    
    _res.send( element!.getProvincia( _req.params.provincia) )*/
     } )


app.get( '/temperaturaPromedio/paises/:pais', async(_req,_res) => {
  try
  {if (!_req.params.pais) {
    return _res.status(400).send("te falto el pais capo")
  }
  let grados:Array<Number> = new Array<Number>  
   const x = await getPais( _req.params.pais )
  x!.provincias.forEach( (provincia) => { provincia.ciudades.forEach( ( c )=>{ c.registroDeTemperatura.forEach( (regis)=>{ grados.push(regis.grados) } ) } ) }  )
  if(!x) { return _res.status(400).send("snickers?")}
  let promedio:Number = new Number; 
  grados.forEach( (celsius)=> { if(!promedio){promedio=celsius.valueOf()}else{promedio=promedio.valueOf()+celsius.valueOf() }  }  )
  if(promedio) { return _res.json({ "promedio" : promedio.valueOf()/grados.length}) }
  return _res.sendStatus(400)}
  catch
  { _res.sendStatus(400) }
 } )




 app.get( '/temperaturaPromedio/paises/:pais/provincias/:provincia', async(_req,_res) => {
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
 } )


 

/*app.post("/paises", async (_req,_res) => {
  const paises = await ConvertColectionToPais(db)
  const x = _req.body as Pais
  const resultado = await collections.paises?.insertOne(Pais)
  //const prueba = (await db.collection("paises").find().toArray()).push()
}) what tho hell oh may gaaa there's no waaaiaiiaiay*/ 

app.post("/paises", async (_req, _res) => {
  try {
      const newPais = _req.body as Pais;

      const existePais = await collections.paises?.findOne({ nombre: newPais.nombre });
      if(existePais){ return _res.status(400).send("Ya existe (leto no podemos poner eso)") }

      const r = await collections.paises?.insertOne(newPais);
      r
          ? _res.status(201).send(`Se creo yei ${r.insertedId}`)
          : _res.status(500).send("Que haces? GAAAAA");
  } catch (error) {
      _res.status(400).send("hola");
  }
});



/*
app.post("/paises/:pais", (_req,_res) => {
  const p = new Provincia(_req.body.nombre, _req.body.ciudades);
  console.log(_req.body.nombre," ", _req.body.ciudades)
  const dirPais = paises.find((pa) => pa.nombre.toLowerCase() === _req.params.pais.toLowerCase())
  if(!dirPais) {return _res.sendStatus(400)}
  const repetido = dirPais.provincias.find( (pa)=>pa.nombre===_req.body.nombre )
  if(repetido){return _res.status(400).send("Ya existe la provincia")}
  console.log(p)
  paises[paises.indexOf(dirPais)].provincias.push(p)
  _res.json(p);   
}) gggggggg*/ 

/*app.post("/paises/:pais", (_req,_res) => {
  const p = new Provincia(_req.body.nombre, _req.body.ciudades);
  const dirPais = paises.find((pa) => pa.nombre.toLowerCase() === _req.params.pais.toLowerCase())
  if(!dirPais) {return _res.status(400)}
  paises[paises.indexOf(dirPais)].provincias.push(p)
  _res.json(p);   
})*/

app.post("/paises/:pais/provincias", async (_req, _res) => {
  const provincia = _req.body as Provincia
  const pais = await getPais( _req.params.pais )
  if (!pais) { _res.status(400).send( "hubo problemas encontrando la coleccion, seguramente no exista." ) }
  pais!.provincias.push( provincia )
  const posteado = await collections.paises?.findOneAndReplace( { nombre: _req.params.pais }, pais )
  _res.status(200).send(posteado?.value)
});



app.post("/paises/:pais/provincias/:provincia/ciudades", async (_req,_res) => {
  const ciudad  = _req.body as Ciudad
  const pais = await getPais( _req.params.pais )
  const provincia = pais.provincias.find( (prov)=> prov.nombre ===_req.params.provincia )
  provincia?.ciudades.push( ciudad )
  const respuesta = await collections.paises?.findOneAndReplace( { nombre: _req.params.pais } , pais )
  return _res.status(200).send( respuesta )
})



app.post("/paises/:pais/provincias/:provincia/ciudades/:ciudad/fechas", async(_req,_res) => {
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
})



app.get('/paises/:pais/provincias/:provincia/ciudades/:ciudad', async (_req,_res)=> { 
  const paises  = await ConvertColectionToPais(db)
  const pais    = await findPais(paises,_req.params.pais)
  if(!pais){return _res.sendStatus(400)}
  const provincia = await findProvincia( pais,_req.params.provincia )
  if(provincia) return _res.status(200).send( await findCiudad( provincia,_req.params.ciudad ) )
  return _res.sendStatus(400)
} )

    

 app.listen(port, () => {console.log(`Escuchando en el puerto ${port}!`); 
 swaggerDocs(app,port)  
});
 

} 


 main()



 /** 
* @openapi
* paths:
*   /paises/{pais}:
*     patch:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*       tags: 
*         - patch
*       summary: Reemplaza los datos del pais por los valores que no sean undefined o false del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Pais'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Pais'
*/


/** 
 * @openapi
 * components:
 *  schemas:
 *    Ciudad:
 *      type: object
 *      required:
 *        -nombre
 *        -registroDeTemperatura
 *      properties:
 *        nombre:
 *          type: string
 *          default:  tiananmensquare
 *        registroDeTemperatura:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Tiempo'
 *    Tiempo:
 *      type: object
 *      required:
 *        -fecha
 *        -grados
 *      properties:
 *        fecha:
 *          type: string
 *          default:  tiananmensquare
 *        grados:
 *          type: number
 *    Provincia:
 *      type: object
 *      required:
 *        -nombre
 *        -ciudades
 *      properties:
 *        nombre:
 *          type: string
 *          default:  BSAS
 *        ciudades:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Ciudad'
 *    Pais:
 *      type: object
 *      required:
 *        -nombre
 *        -provincias
 *      properties:
 *        nombre:
 *          type: string
 *          default:  Argentina
 *        provincias:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Provincia'
 *        
 *        
 */


/** 
* @openapi
* paths:
*   /paises/{pais}:
*     put:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*       tags: 
*         - put
*       summary: Reemplaza todos los valores del pais por los recibidos
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Pais'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Pais'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}:
*     put:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: Pueyrredon
*           required: true
*       tags: 
*         - put
*       summary: Reemplaza todos los datos de la provincia por los del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Provincia'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Provincia'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}:
*     put:
*       parameters:
*         - in: path
*           name: pais
*         - in: path
*           name: provincia
*         - in: path
*           name: ciudad
*       tags: 
*         - put
*       summary: Reemplaza todos los datos de la ciudad por los del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Ciudad'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Ciudad'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}:
*     patch:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: Pueyrredon
*           required: true
*       tags: 
*         - patch
*       summary:  Reepmlaza los datos de la provincia por los datos que no sean undefined o false del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Provincia'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Provincia'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}:
*     patch:
*       parameters:
*         - in: path
*           name: pais
*         - in: path
*           name: provincia
*         - in: path
*           name: ciudad
*       tags: 
*         - patch
*       summary: Reepmlaza los datos de la ciudad por aquellos del body que no sean undefined o false
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Ciudad'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Ciudad'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}/registroDeTiempo/{fecha}:
*     patch:
*       parameters:
*         - in: path
*           name: pais
*         - in: path
*           name: provincia
*         - in: path
*           name: ciudad
*         - in: path
*           name: fecha
*       tags: 
*         - patch
*       summary: Reepmlaza los datos de la fecha por aquellos del body que no sean undefined o false
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Tiempo'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Tiempo'
*/


/** 
* @openapi
* paths:
*   /paises:
*     delete:
*       tags: 
*         - delete
*       summary: Borra el pais cuyo nombre coincida con el enviado en el body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Pais'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Pais'
*       
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/ciudades:
*     delete:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*       tags: 
*         - delete
*       summary: Borra la provincia indicada en el body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Provincia'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Provincia'
*       
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}:
*     delete:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: BSAS
*           required: true
*       tags: 
*         - delete
*       summary: Borra la ciudad indicada en el body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Ciudad'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Ciudad'
*       
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}/fechas:
*     delete:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: BSAS
*           required: true
*         - in: path
*           name: ciudad
*           schema:
*             type: string
*             default: CABA
*           required: true
*       tags: 
*         - delete
*       summary: Borra el registro de tiempo indicado en el body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tiempo'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Tiempo'
*       
*/


/** 
* @openapi
* /paises:
*   get:
*     tags: 
*       - get
*     responses:
*       200:
*         description: Funcionamiento normal
*/


/** 
* @openapi
* /paises/{pais}:
*   get:
*     parameters:
*       - in: path
*         name: pais
*     tags: 
*       - get
*     responses:
*       200:
*         description: Funcionamiento normal
*/


/** 
* @openapi
* /paises/{pais}/{provincia}:
*   get:
*     parameters:
*       - in: path
*         name: pais
*       - in: path
*         name: provincia
*     tags: 
*       - get
*     responses:
*       200:
*         description: Funcionamiento normal
*/


/** 
* @openapi
* /temperaturaPromedio/:
*   get:
*     tags: 
*       - temperaturaPromedio
*     responses:
*       200:
*         description: Funcionamiento normal
*/
    

/** 
* @openapi
* /temperaturaPromedio/paises/{pais}:
*   get:
*     parameters:
*       - in: path
*         name: pais
*     tags: 
*       - temperaturaPromedio
*     responses:
*       200:
*         description: Funcionamiento normal
*/


/** 
* @openapi
* /temperaturaPromedio/paises/{pais}/provincias/{provincia}:
*   get:
*     parameters:
*       - in: path
*         name: pais
*       - in: path
*         name: provincia
*     tags: 
*       - temperaturaPromedio
*     responses:
*       200:
*         description: Funcionamiento normal
*/


/** 
* @openapi
* /paises:
*   post:
*     tags: 
*       - post
*     summary: Agrega un pais con los datos del body
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*              $ref: '#/components/schemas/Pais'
*           
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Pais'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}:
*     post:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*       tags: 
*         - post
*       summary: Agrega una provincia a un pais, con los datos del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Provincia'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Provincia'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}:
*     post:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: Pueyrredon
*           required: true
*       tags: 
*         - post
*       summary: Agrega una ciudad con los datos del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Ciudad'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Ciudad'
*/


/** 
* @openapi
* paths:
*   /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}/fechas:
*     post:
*       parameters:
*         - in: path
*           name: pais
*           schema:
*             type: string
*             default: Argentina
*           required: true
*         - in: path
*           name: provincia
*           schema:
*             type: string
*             default: BSAS
*           required: true
*         - in: path
*           name: ciudad
*           schema:
*             type: string
*             default: CABA
*           required: true
*       tags: 
*         - post
*       summary: Agrega un registro de tiempo con los datos del body
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Tiempo'
*           
*       responses:
*         200:
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Tiempo'
*/


/** 
* @openapi
* /paises/{pais}/provincias/{provincia}/ciudades/{ciudad}:
*   get:
*     parameters:
*       - in: path
*         name: pais
*       - in: path
*         name: provincia
*       - in: path
*         name: ciudad
*     tags: 
*       - get
*     responses:
*       200:
*         description: Funcionamiento normal
*/
