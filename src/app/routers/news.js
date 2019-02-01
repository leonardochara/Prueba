

const connDB = require('../../config/dbConnection');

module.exports = app => {
	const conn = connDB();
	
//	app.get('/', (req, res) => {
//		conn.query('SELECT * FROM tAlumno', (err, resultado) => {
//			res.render('news/news', { 
//			alumnos: resultado
//			});
//		});
//	})

	app.get('/', (req, res) => {
		
			res.render('news/login', { 
				
			});
		
	})

// VALIDAR SI EL USUARIO Y CONTRASENIA ESTAN CORRECTOS
app.post('/validar', (req, res) => {
	
	var username = req.body.username|| '';
	var password = req.body.password|| '';


	var sql = `SELECT * FROM tusuarios WHERE username ='${username}' and password = SHA('${password}')`;

	conn.query(sql, (err, result) => {
		
		if(result.length == 0 ){
			res.render('news/login', {
				
			});	
		}
		else{
			res.render('news/news', {
				
			});	
		}
		
	});
})

// INSERTAR ALUMNO EN LA TABLA
app.post('/insertar', (req, res) => {
	
	if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No hay archivos para subir.');
    }

	var DNI = req.body.DNI || '';
	var apeNom = req.body.apeNom || '';
	var colegio =  req.body.colegio || '';
	var provincia = req.body.provincia || '';
	var nota = req.body.nota || '';
	// var foto = req.body.foto ||'';

	// Recuperando datos
	var tipo = req.files.foto.mimetype;
    var nombre = req.files.foto.name;
    var foto = Buffer.from(req.files.foto.data).toString('hex');



	var sql = `INSERT INTO tAlumno (DNI, apeNom, colegio, provincia, nota, foto) VALUES ('${DNI}','${apeNom}','${colegio}','${provincia}','${nota}',X'${foto}')`;

	conn.query(sql, (err, result) => {
		if (err) {
			console.log(err.code);
			throw err;
		}
		console.log("Filas afectadas: " + result.affectedRows);
		res.redirect('/');
	});
})

// VER Y DOS
app.post('/dos', (req, res) => {
        var imgBuscar = req.body.txtCodigo || '';
        //mostrar fotode codigo seleccionado
        conn.query(`SELECT codImg, nombre FROM imagenes WHERE codImg = ${imgBuscar}`, (err, resultado) => {
            if (err) {
                res.status(404);
                res.json('Imposible ejecutar consulta SELECT');
                res.end();
                return;
            }
            if (resultado.length == 0) {
                res.status(404).json('No existen datos para mostrar').end();
                return;
            }

            res.render('foto/dos', { dato: resultado[0] });
        });
    });

    app.get('/ver', (req, res) => {
        var imgBuscar = req.query.DNI || '';
        //mostrar la primera foto
        conn.query(`SELECT foto FROM tAlumno WHERE DNI = ${imgBuscar}`, (err, resultado) => {
            if (err) {
                res.status(404);
                res.json('Imposible mostrar FOTO');
                res.end();
                return;
            }
            res.end(resultado[0].foto, 'binary');
        });
    }); 


// ELIMINAR ALUMNOS

app.get('/eliminar', (req, res) => {
	var DNI = req.query.id|| '';
	var sql = `DELETE FROM tAlumno WHERE DNI='${DNI}'`;

conn.query(sql, (err, result) => {
		if (err) {
			console.log(err.code);
			throw err;
		}
		console.log("Filas afectadas: " + result.affectedRows);
		res.redirect('/');
	})
});


// EDITAR ALUMNOS
app.get('/editar', (req, res) => { //Recibe parámetros por la barra de dirección
		var codigo = req.query.id;
		var sql = `SELECT DNI, apeNom, colegio, provincia, nota FROM tAlumno WHERE DNI='${codigo}'`;

		conn.query(sql, (err, resultado) => {
		res.render('news/editando', {
			alumno: resultado
		});
	});
});


app.post('/editar', (req, res) => { //Recibe parametros en formato POST
		var DNI = req.body.DNI;
		var apeNom = req.body.apeNom;
		var colegio = req.body.colegio;
		var provincia = req.body.provincia;
		var nota = req.body.nota; 

		var foto = Buffer.from(req.files.foto.data).toString('hex');
		console.log(foto);
		if (foto == null ) {
           var sql = `UPDATE tAlumno SET DNI='${DNI}', apeNom='${apeNom}' , colegio='${colegio}', provincia='${provincia}', nota='${nota}' where DNI='${DNI}' `;
    	}
    	else{
    		var sql = `UPDATE tAlumno SET DNI='${DNI}', apeNom='${apeNom}' , colegio='${colegio}', provincia='${provincia}', nota='${nota}', foto=X'${foto}' where DNI='${DNI}' `;	
    	}

		
		
		conn.query(sql, (err, result) => {
			if (err) {
				console.log(err.code);
				throw err;
			}
			console.log("Filas afectadas: " + result.affectedRows);
		});

		res.redirect('/');
	});

// EDITAR ALUMNOS
app.post('/mostrar', (req, res) => { //Recibe parámetros por la barra de dirección
		var apeNom = req.body.apeNom;
		var sql = `SELECT * FROM tAlumno WHERE apeNom LIKE '${apeNom}%'`; 
		conn.query(sql, (err, resultado) => {
		res.render('news/mostrando', {
			alumnos: resultado
		});
		
	});
});

// SUBIR UNA IMAGEN
app.post('/subir', (req, res) => {
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No hay archivos para subir.');
        }

        // Recuperando datos
        var tipo = req.files.flFoto.mimetype;
        var nombre = req.files.flFoto.name;
        var foto = Buffer.from(req.files.flFoto.data).toString('hex');

        // insertando datos
        var sql = `INSERT INTO imagenes VALUES (DEFAULT,'${tipo}','${nombre}',X'${foto}');`;

        conn.query(sql, (err, resultado) => {
            if (err) {
                res.status(404).json('Imposible ejecutar INSERT').end();
                return;
            }
            res.send('Archivo Subido satisfactoriamente.');
        });
    });

	
	//================= OBTENER UN REPORTE DE ESTUDIANTES EN FORMATO PDF ================
 app.post('/reporte', (req, res) => {
        //recibiendo datos para imprimir informe
        //var nomAlumno = req.query.nomAlumno || '';
        //var nroInforme = req.query.nroInforme || '';

        //consultar tabla
        var sql = `SELECT * FROM tAlumno order by apeNom`;
        conn.query(sql, (err, resultado) => {
        	var PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ size: 'A4' });
            //para descargar
            // res.setHeader('Content-disposition', 'attachment; filename="' + "rinok.pdf" + '"');
            res.setHeader('Content-type', 'application/pdf');
            doc.text('UNIVERSIDAD NACIONAL SAN ANTONIO ABAD DEL CUSCO',{align: 'center'});
            doc.moveDown(1.5);
            doc.image('I:/SEMESTRE 8/LABO 6/pryNode - copia/src/app/views/news/imagen-login.jpg', 25, 20, { scale: 0.15 });
            doc.fontSize(10);
            //doc.text(`INFORME Nº    : ${nroInforme}-CRCEGT-EPIIS-2019`, 40, 180);
            //doc.moveDown(0.1);
//            doc.text('DE                     : Comisión de Revisión y calificación de expedientes de Grados y Títulos');
//            doc.moveDown(0.1);
//            doc.text('AL                      : Decano de la Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica');
//            doc.moveDown(0.1);
//           doc.text('ASUNTO           : Aprobación del expediente de apto al título profesional de Ing. Informático y de Sistemas');
//            doc.moveDown(0.1);
//            doc.text(`RECURRENTE : Director de la Escuela Profesional de Ingenieria Informatica y de Sistemas`);
//            doc.moveDown(0.1);
            //doc.text(`REFERENCIA   : Exp. Nro. ${resultado[0].nroExpediente}-2015`);
            //doc.moveDown(0.1);
            //doc.text(`PROVEIDO       : Nro. ${resultado[0].nroProveido}-FIEEIM-2015`);
            //doc.moveDown(0.1);
            //doc.text(`FECHA              : Cusco, ${fchFormato(new Date(resultado[0].fchInforme), "dd-mmmm-yyyy")}`);

            //doc.rect(40, 285, 490, 1).stroke();
//            doc.moveDown(2);
//            doc.text('Señor Decano, el (la) recurrente ha presentado los siguientes documentos en su expediente para ser declarado Apto al Título Profesional en Ingeniería Informática y de Sistemas', { align: 'justify', indent: 25 });

            //doc.list([`Constancia de no deudor Nro. ${resultado[0].nroNoDeudor} de fecha ${fchFormato(new Date(resultado[0].fchNoDeudor), "dd-mm-yyyy")}`, `Fotocopia simple del DNI nro. 23232323 vigente al 23-25-16`, `Declaración jurada de no tener Antecedentes Penales ni Judicales, fedatado UNSAAC el ${fchFormato(new Date(resultado[0].fchDecAntecedentes), "dd-mm-yyyy")}`, "Recibo de pago por derecho al Título Profesional Nro. 001-01023379 por S/. 430.00"], 55, 350);//
//            doc.moveDown(1.5);
//            doc.text('De acuerdo a la documentación presentada el (la) recurrente cumple las exigencias del Plan Curricular  de la Escuela Profesional de Ingeniería Informática y de Sistemas, cumpliendo además con el artículo 2) inciso a) y b) del reglamento. ', { align: 'justify', indent: 50 });
//            doc.moveDown(1.5);
//            doc.text('Por lo tanto, esta comisión APRUEBA el expediente presentado por el (la) recurrente para optar al Título Profesional de Ingeniero Informático y de Sistemas.', { align: 'justify', indent: 50 });
//            doc.moveDown(1.5);
//            doc.text('Es todo cuanto informamos con respecto a la referencia.', { align: 'justify', indent: 50 });
//
//            //============= LISTA DE ALUMNOS ===========
//            doc.moveDown(1.5);
//            doc.text('Lista de Estudiantes');
//            doc.moveDown(1.5);
//            doc.text('DNI       Apellidos y Nombres      Colegio');
//            doc.moveDown(1.5);
            // ==== CODIGO PARA MOSTRAR EN TABLA ===
//            doc.lineCap('butt').moveTo(270,90).lineTo(270,90).stroke();
//
//            row(doc,90);
//            textInRowFirst(doc,'Nombre o razon social',100);
//
//            function textInRowFirst(doc, text, heigth) {
//  doc.y = heigth;
//  doc.x = 30;
//  doc.fillColor('black')
//  doc.text(text, {
//    paragraphGap: 5,
//    indent: 5,
//   align: 'justify',
//    columns: 1,
//  });
//  return doc
//  }

//        function row(doc, heigth) {
//  doc.lineJoin('miter')
//    .rect(30, heigth, 500, 20)
//   .stroke()
// return doc
//}
            doc.save().lineTo(100,150).stroke();

            //=========================================================== DIBUJAR LA TABLA ===============

            function  dibujarTabla(X,Y,ancho,columnas){

                    // == encabezado ==
                    doc.moveTo(X,Y).lineTo(ancho,Y).stroke();
                    doc.text("DNI",X+5,Y+5);

                    //==== cantidad de columnas
                    for(var i = 1; i < columnas ; i++)
                    {
                        doc.moveTo(ancho/columnas*i,Y).lineTo(ancho/columnas*i,Y+20).stroke();
                        doc.text("Apellidos y Nombres",ancho/columnas*i,Y+5);

                    }

                    // lineas del costado
                    doc.moveTo(X,Y).lineTo(X,Y+20).stroke();
                    doc.moveTo(ancho,Y).lineTo(ancho,Y+20).stroke();

                    // linea de abajo
                    doc.moveTo(X,Y+20).lineTo(ancho,Y+20).stroke();

                    //
            }
            function dibujarFila(X,Y,ancho,columnas,datos){

                    for(var i = 1; i < columnas ; i++)
                    {
                        doc.moveTo(ancho/columnas*i,Y).lineTo(ancho/columnas*i,Y+20).stroke();      
                    }

                    for (var i = 0; i < columnas; i++) {
                        doc.text(`${datos[i]}`,ancho/columnas*i+X,Y+5);
                    }

                    doc.moveDown(0.3);
                    doc.moveTo(X,Y).lineTo(X,Y+20).stroke();
                    doc.moveTo(ancho,Y).lineTo(ancho,Y+20).stroke();

                    // linea de abajo
                    doc.moveTo(X,Y+20).lineTo(ancho,Y+20).stroke();

                    //
            }
            
            dibujarTabla(30,100,600,3);
            
            var acumulador = 100;
            
            for (var i = 0; i < resultado.length ; i++) {
                acumulador = acumulador + 20;
                var datos = [];
                datos.push(resultado[i].DNI);
                datos.push(resultado[i].apeNom);
                datos.push(resultado[i].colegio)
            	dibujarFila(30,acumulador,600,3,datos);
                //doc.text(`${resultado[i].DNI}        ${resultado[i].apeNom}        ${resultado[i].colegio}`);
          		doc.moveDown(1.5);
          	}	


            //area de firmas
            doc.rect(200, 580, 170, 0.2).stroke();
            doc.text("Mgt. Javier Arturo Rozas Huacho", 210, 582);

            doc.rect(50, 650, 170, 0.2).stroke();
            doc.text("Dr. Rony Villafuerte Serna", 70, 652);

            doc.rect(320, 650, 170, 0.2).stroke();
            doc.text("Mgt. Javier David Chávez Centeno", 330, 652);

            //pie de pg
            doc.fontSize(8);
            doc.text("Cc. Archivo", 40, 740);
            doc.moveDown(0.1);
            doc.text("Cc. File (2)");
            doc.moveDown(0.1);
            doc.text("JARH/JDCHC/RVS");

            doc.pipe(res);
            doc.end();
        });


    });

}


