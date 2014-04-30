/**
 * New node file
 */
var mysql = require('./MySQLConnection');


function insertUserInfo(callback, userInfo) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("INSERT INTO users_info (user_id, emailid, address, city, zip, zipextn) VALUES('" + userInfo.userId + "','" +  userInfo.emailId + "','" + userInfo.address + "','" + userInfo.city + "','" + userInfo.zip + "','" + userInfo.zipextn + "')", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("User Information inserted");
			}
		} else {
			console.log("Error in insert user_info query: " + error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.insertUserInfo = insertUserInfo;


function editUserInfo(userInfo) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("UPDATE users_info SET emailid = '" + userInfo.emailId + "', address = '" + userInfo.address + "', city = '" + userInfo.city + "', zip = " + userInfo.zip + ", zipextn = " + userInfo.zipextn + " WHERE user_id  = " + userInfo.userId , function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("User Information edited for " + userInfo.userId);
			}
		} else {
			console.log(error);
		}
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.editUserInfo = editUserInfo;


function deleteUserInfo(userId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("DELETE FROM users_info WHERE user_id  = " + userId + "", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("User Information deleted for " + userId);
			}
		} else {
			console.log(error);
		}
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.deleteUserInfo = deleteUserInfo;



function getUserInfoById(callback, userId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users_info WHERE user_id  = " + userId, function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User Information selected for " + userId);
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.getUserInfoById = getUserInfoById;

function getUserInfoByEmail(callback, email) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users_info WHERE emailid  = '" + email + "'", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User Information selected for " + email);
			}
		} else {
			console.log("Error in selectbyEmail query: " + error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.getUserInfoByEmail = getUserInfoByEmail;

function getAllUsersInfo(callback) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users_info", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Users Information selected");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.getAllUsersInfo = getAllUsersInfo;

function selectUserInfoBySearchCriteria(callback, userId, emailId, address, city, zip, zipextn) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	var query = "SELECT * FROM users_info WHERE ";
	var andFlag = false;
	if(userId != "") {
		query +=" user_id = '" + userId + "'";
		andFlag = true;
	}
	if(emailId != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" emailid = '" + emailId + "'";
		andFlag = true;
	}
	if(address != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" address = '" + address + "'";
		andFlag = true;
	}
	if(city != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" city = '" + city + "'";
		andFlag = true;
	}
	if(zip != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" zip = '" + zip + "'";
		andFlag = true;
	}
	if(zipextn != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" zipextn = '" + zipextn + "'";
		andFlag = true;
	}
	console.log("Query for selectUserInfobysearchcriteria" + query);
	connection.query(query, function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User Information selected for selectUserInfobysearchcriteria");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectUserInfoBySearchCriteria = selectUserInfoBySearchCriteria;