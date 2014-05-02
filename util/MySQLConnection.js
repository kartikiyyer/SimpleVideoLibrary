/**
 * New node file for database connection
 */
function createdbConnection() {
	var mysql = require('mysql');

	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'password',
		port: '3306',
		database: 'videolibrary'
	});
	
	connection.connect(function(error) {
		if(!error) {
			console.log("Connected!!!");
		} else{
			console.log(error);
		}
	});
	return connection;
}

exports.createdbConnection = createdbConnection;

function closedbConnection(connection) {
	connection.end();
}

exports.closedbConnection = closedbConnection;

var queue = [];


function getdbConnection() {
	return queue.shift();
}

exports.getdbConnection = getdbConnection;

function releasedbConnection(connection) {
	console.log("Releasing connection");
	console.log("Before" + queue.length);
	queue.push(connection);
	console.log("After" + queue.length);
}

exports.releasedbConnection = releasedbConnection;

function createdbConnectionPool() {
	console.log("Creating connection pool");
	for(var i=0;i<10;i++) {
		queue[i] = createdbConnection();
	}
	return queue;
}

exports.createdbConnectionPool = createdbConnectionPool;

