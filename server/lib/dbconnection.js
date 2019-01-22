const mysql = require('mysql');
require('dotenv').config();

const connectionVars = {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || '3306',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
};

// console.table(connectionVars);

const connection = mysql.createConnection(connectionVars);

connection.connect();
module.exports = connection;
