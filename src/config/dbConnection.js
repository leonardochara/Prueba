const mysql = require('mysql');
module.exports = () => {
	return mysql.createConnection(
		{
			host: 'localhost',
  			user: 'root',
  			database: 'DB_unsaac'
		}
   )
}
