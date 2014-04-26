/**
 * New node file
 */
var moviedb = require('../util/Moviedb');
var mysql = require("../util/MySQLConnection");
//var connection = mysql.createdbConnection();
mysql.createdbConnectionPool();

function testMoviedb() {
	
	var movieDetails = [];
	
	movieDetails.movieName = "Update";
	movieDetails.movieBanner = "Update";
	movieDetails.rentAmount = "10.01";
	movieDetails.releaseDate = "2011";
	movieDetails.availableCopies = "4";
	movieDetails.category = "Test";
	movieDetails.movieId = "85546";
	
		
	//moviedb.insertMovie(movieDetails);
	
	//moviedb.editMovie(movieDetails);
	
	moviedb.selectMovieById(function(results, error) {
		console.log(results);
	},85546);
	
	//moviedb.selectMovieBySearchCriteria(function(results, error) {
	//		console.log(results);
	//},"","","","0","5",false);
	//moviedb.deleteMovie(85545);
	
}

//testMoviedb();