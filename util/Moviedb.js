/**
 * New node file modified by Mihir
 */
var mysql = require('./MySQLConnection');

function insertMovie(callback, movieDetails) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("INSERT INTO movie (movie_name, movie_banner, release_date, rent_amount, available_copies, category) VALUES('" + movieDetails.movieName + "','" + movieDetails.movieBanner + "','" + movieDetails.releaseDate + "','" + movieDetails.rentAmount + "','" + movieDetails.availableCopies + "','" + movieDetails.category + "')", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("Movie details inserted");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.insertMovie = insertMovie;

function editMovie(callback, movieDetails) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("UPDATE movie SET movie_name = '" + movieDetails.movieName + "', movie_banner = '" + movieDetails.movieBanner + "', release_date = '" + movieDetails.releaseDate + "', rent_amount = '" + movieDetails.rentAmount + "', available_copies = '" + movieDetails.availableCopies + "', category = '" + movieDetails.category + "' WHERE movie_id  = '" + movieDetails.movieId + "'", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("Movie details edited for " + movieDetails.movieId);
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.editMovie = editMovie;

function deleteMovie(callback, movieId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("DELETE FROM movie WHERE movie_id  = '" + movieId + "'", function(error, results) {
		if(!error) {
			console.log(results);
			if(results.length !== 0) {
				console.log("Movie details deleted for " + movieId);
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.deleteMovie = deleteMovie;

function selectMovieById(callback, movieId) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	connection.query("SELECT movie_id, movie_name, movie_banner, release_date, rent_amount, available_copies, category FROM movie WHERE movie_id  = '" + movieId + "'", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Movie details selected for " + movieId);
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectMovieById = selectMovieById;

function selectMovies(callback) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	// Limited to 5000 for development purpose.
	connection.query("SELECT movie_id, movie_name, movie_banner, release_date, rent_amount, available_copies, category FROM movie LIMIT 5000", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Movie details selected");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectMovies = selectMovies;

function selectMovieBySearchCriteria(callback, movieName, banner, releaseDate, category, minPrice, maxPrice, isAvailable) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	var query = "SELECT movie_id, movie_name, movie_banner, release_date, rent_amount, available_copies, category FROM movie WHERE ";
	var andFlag = false;
	if(movieName != "") {
		query +=" movie_name LIKE '%" + movieName + "%'";
		andFlag = true;
	}
	if(banner != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" movie_banner LIKE '%" + banner + "%'";
		andFlag = true;
	}
	if(releaseDate != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" release_date = '" + releaseDate + "'";
		andFlag = true;
	}
	if(category != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" category LIKE '%" + category + "%'";
		andFlag = true;
	}
	if(minPrice != "" && maxPrice != "") {
		if(andFlag) {
			query += " AND ";
		}
		query +=" rent_amount BETWEEN '" + minPrice + "' AND '" + maxPrice +"'";
		andFlag = true;
	}
	if(isAvailable) {
		if(andFlag) {
			query += " AND ";
		}
		query +=" available_copies <> 0";
	}
	console.log("Query for selectMoviebysearchcriteria: " + query);
	connection.query(query, function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Movie details selected for selectMoviebysearchcriteria");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectMovieBySearchCriteria = selectMovieBySearchCriteria;

function selectCategories(callback) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	// Limited to 5000 for development purpose.
	connection.query("SELECT DISTINCT(category) AS category FROM movie ORDER BY category ASC", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Movie category selected");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectCategories = selectCategories;


function selectReleaseDate(callback) {
	var connection = mysql.createdbConnection();
	//var connection = mysql.getdbConnection();
	// Limited to 5000 for development purpose.
	connection.query("SELECT DISTINCT(release_date) AS release_date FROM movie ORDER BY release_date ASC", function(error, results) {
		if(!error) {
			//console.log(results);
			if(results.length !== 0) {
				console.log("Movie release date selected");
			}
		} else {
			console.log(error);
		}
		callback(results, error);
	});
	mysql.closedbConnection(connection);
	//mysql.releasedbConnection(connection);
}

exports.selectReleaseDate = selectReleaseDate;
