var PDFDocument, doc;
var fs = require('fs');
PDFDocument = require('pdfkit');
doc = new PDFDocument;
doc.pipe(fs.createWriteStream('output.pdf'));

// Set a title and pass the X and Y coordinates
doc.fontSize(15).text('Hola mundo !', 50, 50);
// Set the paragraph width and align direction
doc.text('hay muchos detalles en esta linea, solo se usa de relleno ', {
    width: 410,
    align: 'left'
});

doc.image('C:/Users/Frank/Pictures/Saved Pictures/jagtiger.jpg', 50, 150, { width: 300 });

// poner mi nombre
doc.fillColor('red').text('Frank ', {
    width: 410,
    align: 'left'
});


// PDF Creation logic goes here
doc.end();