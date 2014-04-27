var Userdb = require('../util/Users');
/*
 * GET users listing.
 */

exports.login = function(req, res){
  //res.send("respond with a resource");
	res.render("login");
};

exports.validateLogin = function(req, res){
	  //res.send("respond with a resource");
		console.log("inside Validate Login");
		if(!req.body.hasOwnProperty('membershipNo') ||!req.body.hasOwnProperty('password')) {
			res.statusCode = 400;
			return res.send('Error 400: Post syntax incorrect.');
		}
		
		Userdb.validateLogin(function(err,results){
			if(err){
				throw err;
			}else{
				//console.log("query result fetched");
				req.session.userdetails = JSON.stringify({userId : results[0].USERID, membershipNo : results[0].MEMBERSHIP_NO, firstname :  results[0].FIRSTNAME, lastname : results[0].LASTNAME, issuedMovies : results[0].ISSUED_MOVIES, outstandingMovies : results[0].OUTSTANDING_MOVIES, memberTypes : results[0].MEMBER_TYPES, balanceAmount : results[0].BALANCE_AMOUNT, roleId : results[0].ROLE_ID});
				//console.log(req.session.userdetails);
				res.render('index',
						{userDet : results[0]},
						function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		},req.param('membershipNo'),req.param('password'));
	};