import * as mongoDB from "mongodb";
import { Ciudad } from '../Ciudad';
import { Pais } from '../Pais';
import { Provincia } from '../Provincia';
import { Tiempo } from '../Tiempo';


const DB_CONN_STRING="mongodb://localhost:27017"
const DB_NAME="BaseDeTemperaturas"
const COLLECTION_NAME="paises"

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

async function connectToDatabase () {  
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
                
    await client.connect();
        
    const db: mongoDB.Db = client.db(DB_NAME);
    const paisesCollection: mongoDB.Collection = db.collection(COLLECTION_NAME);
    collections.paises = paisesCollection;
        
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${paisesCollection.collectionName}`);
    return db;
}

const db: mongoDB.Db = await connectToDatabase();




export default {
    getPaises: (async (_req,_res)=> {   
         _res.status(200).send(await ConvertColectionToPais(db)) 
    }),

    getPais:(async(_req,_res)=> {
        const pais = getPais(_req.params.pais)
        _res.status(200).send(pais)   
    }),
    
    updatePais:(async (_req, _res) => {
        try {
            const pais = _req.body as Pais
            collections.paises?.findOneAndReplace( {nombre:_req.params.pais} , pais)
            return _res.status(200).send("mando may guey")
        } catch (error) {
            _res.status(400).send("el que dice error es puto");
        }
    }),

    changePais: (async (_req,_res)=> {
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
    }),
    
    deletePais:(async (_req, _res) => {
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
    })

}  