/**
 * New node file
 */
var moviedb = require('../util/Moviedb');

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
		//console.log(results);
	},85546);
	
	//moviedb.selectMovieBySearchCriteria(function(results, error) {
	//		console.log(results);
	//},"","","","0","5",false);
	//moviedb.deleteMovie(85545);
	
}

//testMoviedb();

/**
 * List all movies
 */
exports.listMovie = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var movies = null;
			var categories = [];
			var releaseDates = [];
			// TODO: Fetch information of user
			
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var category = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					category = results[i].category.split(",");
					for(var j=0;j<category.length;j++) {
						var cat = category[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				// Fetch movies from database
				moviedb.selectReleaseDate(function(results,error) {
					/*for(var i=0 ;i<results.length;i++) {
						movies[i] = results[i];
					}*/
					releaseDates = results;
					
					// Fetch movies from database
					moviedb.selectMovies(function(results,error) {
						/*for(var i=0 ;i<results.length;i++) {
							movies[i] = results[i];
						}*/
						movies = results;
						
						//res.render('listmovie', { "user":user, "movies": movies});
						res.render('listmovie', {"userDet" : user,"movies": movies, "categories":categories, "releaseDates": releaseDates});
					});
				});
			});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}


exports.showMovie = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var movieId = req.params.id;
			var movie = null;
			var users = null;
			moviedb.selectMovieById(function(results,error){
				movie = results[0];
				moviedb.selectUsersIssuedMovie(function(results, error) {
					if(results != null && results.length > 0) {
						users = results[0];
					}
					res.render('movie', {"userDet" : user,"movie": movie,"users":users});
				}, movieId);				
			}, movieId);
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}

/**
 * List all movies
 */
exports.searchMovie = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var mname = req.body.mname;
			var banner = req.body.banner;
			var releasedate = req.body.releasedate;
			var rentamountmin = req.body.rentamountmin;
			var rentamountmax = req.body.rentamountmax;
			var category = req.body.category;
			var isAvaliable = req.body.isAvaliable;
			
			var movies = null;
			var categories = [];
			var releaseDates = [];
			// TODO: Fetch information of user
	
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var categoryList = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					categoryList = results[i].category.split(",");
					for(var j=0;j<categoryList.length;j++) {
						var cat = categoryList[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				// Fetch movies from database
				moviedb.selectReleaseDate(function(results,error) {
					/*for(var i=0 ;i<results.length;i++) {
						movies[i] = results[i];
					}*/
					releaseDates = results;
					
					// Fetch movies from database
					moviedb.selectMovieBySearchCriteria(function(results,error) {
						/*for(var i=0 ;i<results.length;i++) {
							movies[i] = results[i];
						}*/
						movies = results;
						//res.render('listmovie', { "user":user, "movies": movies});
						res.render('listmovie', {"userDet" : user,"movies": movies, "categories":categories, "releaseDates": releaseDates});
					}, mname, banner, releasedate, category, rentamountmin, rentamountmax, isAvaliable);
				});
			});	
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}

exports.createmovie = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var categories = [];
			
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var categoryList = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					categoryList = results[i].category.split(",");
					for(var j=0;j<categoryList.length;j++) {
						var cat = categoryList[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				res.render("createmovie",{"userDet" : user,"insertedresults":null,"categories":categories});
			});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
};


exports.createMovieSubmit = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
				var movieDetails = [];
				movieDetails.movieName = req.body.mname;
				movieDetails.movieBanner = req.body.banner;
				movieDetails.rentAmount = req.body.rentamount;
				movieDetails.releaseDate = req.body.releasedate;
				movieDetails.availableCopies = req.body.copies;
				movieDetails.category = req.body.category;
				//moviedb.insertMovie(movieDetails);
					
				var categories = [];						
				// Fetch categories from database
				moviedb.selectCategories(function(results,error) {
					var categoryList = [];
					var count = 0;
					for(var i=0 ;i<results.length;i++) {
						categoryList = results[i].category.split(",");
						for(var j=0;j<categoryList.length;j++) {
							var cat = categoryList[j].trim();
							if(categories.indexOf(cat) == -1) {
								categories[count++] = cat; 
							}
						}
					}
					categories = categories.sort();
					moviedb.selectMovieBySearchCriteria(function(results, error){	
						//console.log(results);
						if(results == null || results.length == 0) {				
							moviedb.insertMovie(function(results, error) {
								res.render("createmovie",{"userDet" : user,"insertedresults":"Movie inserted successfully.","categories":categories});
							},movieDetails);
						} else {
							res.render("createmovie",{"userDet" : user,"insertedresults":"Duplicate movie name.","categories":categories});
						}
					},movieDetails.movieName);
				});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}


exports.editMovie = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var categories = [];
			var movieId = req.params.id;
			//console.log(movieId);
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var categoryList = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					categoryList = results[i].category.split(",");
					for(var j=0;j<categoryList.length;j++) {
						var cat = categoryList[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				
				// Fetch movies from database
				moviedb.selectMovieById(function(results,error) {
					res.render("editmovie",{"userDet" : user,"editedresults":null,"categories":categories, "movie":results[0]});
				},movieId);
			});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}

exports.editMovieSubmit = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var movieDetails = [];
			movieDetails.movieId = req.body.movieId;
			movieDetails.movieName = req.body.mname;
			movieDetails.movieBanner = req.body.banner;
			movieDetails.rentAmount = req.body.rentamount;
			movieDetails.releaseDate = req.body.releasedate;
			movieDetails.availableCopies = req.body.copies;
			movieDetails.category = req.body.category;
			//moviedb.insertMovie(movieDetails);
				
			moviedb.editMovie(function(results, error) {
				res.writeHead(301,
						{Location: "/listmovie"}			
					);
				res.end();
			},movieDetails);
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
}

exports.deleteMovie = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var movieId = req.params.id;
			moviedb.deleteMovie(function(results, error) {
				res.writeHead(301,
						{Location: "/listmovie"}			
					);
				res.end();
			},movieId);
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}	
};

/**
 * User side operations
 */

/**
 * List all movies
 */
exports.listMovieUser = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null) {
			var movies = null;
			var categories = [];
			var releaseDates = [];
			// TODO: Fetch information of user
			
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var category = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					category = results[i].category.split(",");
					for(var j=0;j<category.length;j++) {
						var cat = category[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				// Fetch movies from database
				moviedb.selectReleaseDate(function(results,error) {
					/*for(var i=0 ;i<results.length;i++) {
						movies[i] = results[i];
					}*/
					releaseDates = results;
					
					// Fetch movies from database
					moviedb.selectMovies(function(results,error) {
						/*for(var i=0 ;i<results.length;i++) {
							movies[i] = results[i];
						}*/
						movies = results;
						
						//res.render('listmovie', { "user":user, "movies": movies});
						res.render('\\users\\viewusermovies', {"userDet" : user,"movies": movies, "categories":categories, "releaseDates": releaseDates});
					});
				});
			});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
};


exports.showMovieUser = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user != null) {
			var movieId = req.params.id;
			var movie = null;
			var users = null;
			moviedb.selectMovieById(function(results,error){
				movie = results[0];
				moviedb.selectUsersIssuedMovie(function(results, error) {
					if(results != null && results.length > 0) {
						users = results[0];
					}
					res.render('\\users\\usermovie', {"userDet" : user,"movie": movie,"users":users});
				}, movieId);
			}, movieId);
		} else {
			res.render("accessdenied");
		}
	} else {
		res.writeHead(301,
				{Location: "/"}
			);
		res.end();
	}
};

/**
 * List all movies
 */

exports.searchMovieUser = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null) {
			var mname = req.body.mname;
			var banner = req.body.banner;
			var releasedate = req.body.releasedate;
			var rentamountmin = req.body.rentamountmin;
			var rentamountmax = req.body.rentamountmax;
			var category = req.body.category;
			var isAvaliable = req.body.isAvaliable;
			
			var movies = null;
			var categories = [];
			var releaseDates = [];
			// TODO: Fetch information of user
	
			// Fetch categories from database
			moviedb.selectCategories(function(results,error) {
				var categoryList = [];
				var count = 0;
				for(var i=0 ;i<results.length;i++) {
					categoryList = results[i].category.split(",");
					for(var j=0;j<categoryList.length;j++) {
						var cat = categoryList[j].trim();
						if(categories.indexOf(cat) == -1) {
							categories[count++] = cat; 
						}
					}
				}
				categories = categories.sort();
				// Fetch movies from database
				moviedb.selectReleaseDate(function(results,error) {
					/*for(var i=0 ;i<results.length;i++) {
						movies[i] = results[i];
					}*/
					releaseDates = results;
					
					// Fetch movies from database
					moviedb.selectMovieBySearchCriteria(function(results,error) {
						/*for(var i=0 ;i<results.length;i++) {
							movies[i] = results[i];
						}*/
						movies = results;
						//res.render('listmovie', { "user":user, "movies": movies});
						res.render('\\users\\viewusermovies', {"userDet" : user,"movies": movies, "categories":categories, "releaseDates": releaseDates});
					}, mname, banner, releasedate, category, rentamountmin, rentamountmax, isAvaliable);
				});
			});	
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
};