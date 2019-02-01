const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());






//app.use(body_parser.urlencoded({ extended: true })); 
//mi cambio RINOK

//configuración
app.set('port', process.env.PORT || 3000);

//TEMPLATE a usar
app.set('view engine', 'ejs');
//app.set('view engine', 'hbs');
//app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../app/views'));

//intercambio
app.use(bodyParser.urlencoded({ extended: true })); 
//mi cambio RINO comentado "false"
module.exports = app;

app.use('/util',express.static('I:/SEMESTRE 8/LABO 6/pryNode - copia/src/config/js'));
