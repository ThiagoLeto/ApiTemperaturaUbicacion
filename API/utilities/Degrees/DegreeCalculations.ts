import {dbPromise,DB_CONN_STRING,DB_NAME,COLLECTION_NAME,ConvertColectionToPais,ConvertDocumentToPais,getPais,findPais,findCiudad,findProvincia,collections} from '../DataBaseFunctions/DBFunctions'

export async function calcGlobalSUM(grados:Array<number>){
    if(grados.length<=0){return false}
    let promedio:number; 
    grados.forEach( (celsius)=> { 
      if(!promedio){promedio=celsius.valueOf()}
      else{promedio=promedio.valueOf()+celsius.valueOf()}  
    })
    
    return promedio!
}

export async function getDegrees( ) {
    
  let grados:Array<number> = new Array<number>  
  let paises = await ConvertColectionToPais(await dbPromise)
  console.log(paises);
    
  paises.forEach( (pais)=> {
    pais.provincias.forEach((provincia)=>{ 
      console.log(provincia);
      provincia.ciudades.forEach( (ciudad)=>{console.log(ciudad);
        ciudad.registroDeTemperatura.forEach( (x)=>{ 
          console.log(grados.push(x.grados));console.log( grados );
          return grados;
        }) 
      })  
    })
  })
  return grados
}