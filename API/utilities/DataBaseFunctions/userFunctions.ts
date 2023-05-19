import {DB_CONN_STRING,DB_NAME} from './DBFunctions'
import {sha512} from 'sha512-crypt-ts'
import { user } from '../../models/user';
import * as mongoDB from "mongodb";
import * as jwt from 'jsonwebtoken';
export const usuarios: { Users?: mongoDB.Collection } = {}
const COLLECTION_NAME = "Users"


export function hashear( psswrd:string, ){
    let salt = Date.now()+""+Date.now()
    salt = salt.slice( 0,salt.length-10)
    const hash = sha512.crypt(psswrd,salt)
    console.log(hash)
    const shalt = {"hash":hash,"salt":salt} 
    return shalt
} 
export function hashearWSaltEspecifico( psswrd:string,salt:string){
    const hash = sha512.crypt(psswrd,salt)
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

export async function confirm(name:string,db:mongoDB.Db){
    return await usuarios.Users?.findOne( {nombre:name} )
}

/*
pruebaDeInsert()*/

    async function pruebaDeInsert() {
    await conectUserDataBase()
    await insertUser("ValentinoGarcia","nigger")
}


async function compareHash(hash:string,DocUsuario:mongoDB.WithId<mongoDB.BSON.Document>) {
    const usuario = new user(DocUsuario.nombre,DocUsuario.hash,DocUsuario.salt);
    console.log(usuario.hash)
    console.log(hash)
    if(hash==usuario.hash){
    return usuario
     }
     return false
}

export async function login(name:string,psswrd:string,db:mongoDB.Db) {
    const DocUsuario = await confirm(name,db)
    if(!DocUsuario){console.log("no existe el usuario");return false}
    const salt = DocUsuario.salt
    console.log(salt);
    
    const hash = hashearWSaltEspecifico(psswrd,salt)
    console.log(hash);
    const foundUser=await compareHash(hash.hash,DocUsuario)
    if (foundUser) { 
        const token = jwt.sign({name: foundUser.nombre,hash:hash }, "cambiarPorUnaVariable", {
            expiresIn: '2 days',
          })
          return { "Auth":{token: token} };
     }
        
}

async function pruebaLogin() {
    
    const borrardsp = await conectUserDataBase()
    login("ValentinoGarcia","nigger",borrardsp)
}

export async function loginToken(token:string,db:mongoDB.Db) {
    return jwt.verify(token,"cambiarPorUnaVariable")
    
//    if(typeof(pack)!="string"){console.log("pack: "+ pack.payload);}
    //return pack
    //if(foundUser){return true}else{return false}
}
/*
pruebaLogin()*/