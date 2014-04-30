/**
 * New node file
 */
var mysql = require('./MySQLConnection');

function insertUser(callback,user) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("INSERT INTO users (membership_no, password,  firstname, lastname, issued_movies, outstanding_movies, member_type, balance_amount, role_id) VALUES('" + user.membershipNo + "', MD5('" + user.password + "'),'" +  user.firstname + "','" +  user.lastname + "','" +  user.issuedMovies + "','" + user.outstandingMovies + "','" + user.memberType + "','" + user.balanceAmount + "','" + user.roleId + "')", function(error, results) {
		if(!error) {
			if(results.length !== 0) {
				console.log("User details inserted");
			}
		} else {
			console.log("Insert User : " + error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.insertUser = insertUser;



function editUser(user) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("UPDATE users SET membership_no = " + user.membershipNo + ", firstname = " + user.firstname + ", lastname = " + user.lastname + ", issued_movies = " + user.issuedMovies + ", outstanding_movies = " + user.outstandingMovies + ", member_types = '" + user.memberTypes + "', balance_amount = " + user.balanceAmount + ", role_id = " + user.roleId + "' WHERE userid  = " + user.userId, function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("User details edited for " + userDetails.userId);
			}
		} else {
			console.log(error);
		}
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.editUser = editUser;




function deleteUser(userId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("DELETE FROM users WHERE userid  = " + userId + "", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("User details deleted for " + userId);
			}
		} else {
			console.log(error);
		}
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.deleteUser = deleteUser;



function selectUserById(callback, userId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users WHERE user_id  = " + userId, function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User details selected for " + userId);
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

function selectUserByMembershipNo(callback, membershipNo) {
	console.log("membership no param: " + membershipNo);
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users WHERE membership_no  = '" + membershipNo + "'" , function(error, results) 
	{
		if(!error) 
		{
			console.log(results);
			if(results.length !== 0) 
			{
				console.log("User details selected for " + membershipNo);
			}
		} else 
		{
			console.log("Error from SelectUserbyMemId: " + error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectUserByMembershipNo = selectUserByMembershipNo;

function validateLogin(callback, membershipNo, password) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users WHERE membership_no  = '" + membershipNo + "' and password = MD5('" + password + "')", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User details selected for " + membershipNo);
			}
		} else {
			console.log(error);
		}
		callback(error, results);
		console.log("returning results");
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.validateLogin = validateLogin;

function selectUsers(callback) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT * FROM users", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Users details selected");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectUsers = selectUsers;

function selectUserBySearchCriteria(callback, userId, membershipNo, firstname, lastname, minIssuedMovies, maxIssuedMovies, minOutstandingMovies, maxOutstandingMovies, memberTypes, minBalanceAmount, maxBalanceAmount, roleId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	var query = "SELECT * FROM users WHERE ";
	var andFlag = false;
	if(userId != "") {
		query +=" userid = '" + userId + "'";
		andFlag = true;
	}
	if(membershipNo != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" membership_no = '" + membershipNo + "'";
		andFlag = true;
	}
	if(firstname != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" firstname = '" + firstname + "'";
		andFlag = true;
	}
	if(lastname != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" lastname = '" + lastname + "'";
		andFlag = true;
	}
	if(minIssuedMovies != "" && maxIssuedMovies != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" issued_movies BETWEEN '" + minIssuedMovies + "' AND '" + maxIssuedMovies +"'";
		andFlag = true;
	}
	if(minOutstandingMovies != "" && maxOutstandingMovies != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" outstanding_movies BETWEEN '" + minOutstandingMovies + "' AND '" + maxOutstandingMovies +"'";
		andFlag = true;
	}
	if(memberTypes != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" member_types = '" + memberTypes + "'";
		andFlag = true;
	}
	if(minBalanceAmount != "" && maxBalanceAmount != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" balance_amount BETWEEN '" + minBalanceAmount + "' AND '" + maxBalanceAmount +"'";
		andFlag = true;
	}
	if(roleId != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" role_id = '" + roleId + "'";
		andFlag = true;
	}
	console.log("Query for selectUserbysearchcriteria" + query);
	connection.query(query, function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("User details selected for selectUserbysearchcriteria");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectUserBySearchCriteria = selectUserBySearchCriteria;