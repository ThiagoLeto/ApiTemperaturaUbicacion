import express, { json } from 'express';
import swaggerDocs from './swagger';
import { paisRoutes } from "./routes/paisRoutes";
import { provinciasRoutes } from './routes/provinciaRoutes';
import { ciudadesRoutes } from './routes/ciudadRoutes';
import { tiemposRoutes } from './routes/tiempoRoutes';
import { UserRoutes } from './routes/userRoutes';

const app = express();
app.use(express.json());
const port = 3000

paisRoutes(app)
provinciasRoutes(app)
ciudadesRoutes(app)
tiemposRoutes(app)
UserRoutes(app)


async function main() {
  app.get('/', (_req , _res) => _res.send('Bienvenido a mi API REST!'));

  app.listen(port, () => {console.log(`Escuchando en el puerto ${port}!`); 
    swaggerDocs(app,port)  
  }); 
} 

main()

/*

npm init
npm install typescript --save --dev
// npm install ts-node --save --dev
npm install nodemon --save --dev
npm install express
npm install @types/express 
npm tsc --init

npm install mongodb 
npm install ts-node
npm install swagger-ui-express
npm install swagger-jsdoc

npm install jsonwebtoken bcryptjs express-jwt @types/express-jwt @types/jsonwebtoken @types/bcryptjs

npx nodemon index.ts

*/ 



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
*   /paises/{pais}/provincias:
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
*   /paises/{pais}/provincias/{provincia}/ciudades:
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
* /paises/{pais}/provincias/{provincia}:
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
* /temperaturaPromedio/paises:
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
*   /paises/{pais}/provincias:
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
*   /paises/{pais}/provincias/{provincia}/ciudades:
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
