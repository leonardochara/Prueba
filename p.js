var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'DB_unsaac'

  
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



