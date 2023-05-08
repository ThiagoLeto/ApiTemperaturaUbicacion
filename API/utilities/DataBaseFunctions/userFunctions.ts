import {DB_CONN_STRING,DB_NAME} from './DBFunctions'
import {sha512} from 'sha512-crypt-ts'
import { user } from '../../models/user';
import * as mongoDB from "mongodb";
export const usuarios: { Users?: mongoDB.Collection } = {}
const COLLECTION_NAME = "Users"


export function hashear( psswrd:string ){
let salt = Date.now()+""+Date.now()
salt = salt.slice( 0,salt.length-10)
const hash = sha512.crypt("snickers",salt)
console.log(hash)
const shalt = {"hash":hash,"salt":salt} 
return shalt
} 

export async function conectUserDataBase () {
    // dotenv.config();
  
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
            
    await client.connect();
    
    const db: mongoDB.Db = client.db(DB_NAME);
    const usersCollection: mongoDB.Collection = db.collection(COLLECTION_NAME);
    usuarios.Users = usersCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
    return db;
  }


export async function insertUser(name:string,psswrd:string) {
    const packet = hashear(psswrd)
    const hash = packet.hash
    const salt = packet.salt
    const existeUser=await usuarios.Users?.findOne( {nombre:name} )
    console.log(existeUser);
    
    if (existeUser){return false}
    const newUser = new user(name,hash,salt)
    return await usuarios.Users?.insertOne(newUser);
    
}
export async function confirm(name:string,hash:string,db:mongoDB.Db){
    const existeUser=db.collection(COLLECTION_NAME)
    if(!existeUser){ return false }
    
}

pruebaDeInsert()
async function pruebaDeInsert() {
await conectUserDataBase()
await insertUser("thiagoLeto","apalapapuli")
}
async function pruebaDeLogin() {

}