export const DB_CONN_STRING="mongodb://localhost:27017"
export const DB_NAME="BaseDeTemperaturas"
export const COLLECTION_NAME="paises"
import * as mongoDB from "mongodb";
import { Pais } from '../models/Pais';
import { Provincia } from '../models/Provincia';

export const collections: { paises?: mongoDB.Collection } = {}

export async function findPais(paises:Pais[],target:string) {
  return paises.find( (pais)=> pais.nombre.toLowerCase() === target.toLocaleLowerCase() )
}
export async function ConvertColectionToPais(db:mongoDB.Db): Promise<Pais[]> {
  const col = await db.collection("paises").find().toArray();
  let paises:Pais[]=[]
  col.forEach( (obj)=>{ const pais:Pais = new Pais(obj.nombre,obj.provincias);paises.push(pais) } )
  return paises
}

export async function ConvertDocumentToPais(document:mongoDB.WithId<mongoDB.BSON.Document>) :Promise<Pais>{
  let pais:Pais = new Pais( document.nombre,document.provincias )
  return pais
}

export async function getPais(target:string ) {
  const doc = await collections.paises?.findOne( {nombre: target} )
  let pais = ConvertDocumentToPais(doc!)  
  return pais
}

export async function findCiudad(provincia:Provincia,target:string) {
  return provincia.ciudades.find( (ciudad)=> ciudad.nombre.toLowerCase()===target.toLowerCase() )
}

export async function findProvincia(pais:Pais,target:string) {
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
  
export const dbPromise =  connectToDatabase()
