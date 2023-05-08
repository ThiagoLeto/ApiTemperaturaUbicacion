import { Express } from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options= {
    definition:{
        openapi:"3.0.0",
        info:{
            title:'API Documentation',
            version: "1.0.0"
        },
        components:{ securitySchemas:{
            bearerAuth:{
                type:'http',
                scheme:"bearer",
                bearerFormat:"JWT",
            },
        } ,
        },
        security:[
            {bearerAuth:[],},
        ],
    },

    apis:['./index.ts']

}

const swaggerSpec=swaggerJsdoc(options)

function swaggerDocs( app:Express,port:number ){ 
    app.use('/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec))
    app.get( "docs.json", ( _req, _res )=>{
        _res.setHeader( "Content-Type","application/json" )
      }  )
  }

  export default swaggerDocs