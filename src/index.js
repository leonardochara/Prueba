/**
* AUTOR: Rony Villafuerte Serna
* FECHA: 12-NOV-2018
* DESCRIPCION: Pequeño proyecto nodejs con mySQL
*
* requiere edición e instalación de:
* npm init --yes
* npm i express ejs mysql body-parse --save
* Ejecutar con:
* npm start
* Previa configuración del "package.json" agregando en script la
línea
* "start": "node src/index.js"
*/
const app = require('./config/server');
require('./app/routers/news')(app);
//escuchando puerto
app.listen(app.get('port'), () => {
console.log('Escuchando en el puerto: ', app.get('port'));
})