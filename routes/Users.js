var Userdb = require('../util/Userdb');

/*
 * GET users listing.
 */

exports.login = function(req, res){
	//console.log("hi");
  //res.send("respond with a resource");
	if(req.session.userdetails == null || req.session.userdetails == "") {
		res.render("login");
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}	
};

exports.signOut = function(req, res) {
	if(req.session.userdetails != null || req.session.userdetails != "") {
		req.session.userdetails = null;
	} 
	res.writeHead(301,
				{Location: "/"}			
	);
	res.end();
};

exports.createmember = function(req, res){
	//console.log("hi create");
	if(req.session.userdetails != null && req.session.userdetails != "") {		
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			Userdb.selectRole(function(results,error) {
				res.render("createmember",{"userDet" : user,"insertedresults":null, "roles": results});	
			});	
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/login"}			
			);
		res.end();
	}
};


exports.createMemberSubmit = function(req,res) 
{
	if(req.session.userdetails != null && req.session.userdetails != "") {
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			//var user = [];
			var userInfo= [];
			var userId;
			var roles;
			Userdb.selectRole(function(results,error) {
				roles = results;
				Userdb.selectUserByEmail(function(results,err)
				{
					if(err)
					{
						console.log("email err");
						console.log(err);
						res.render("createmember",{"userDet" : user,"insertedresults":"Email query problem","roles":roles});
					}else
					{
						if(results.length>0)
						{
							console.log("email query result :" + results);
							res.render("createmember",{userDet : user,"insertedresults":"MEMBER EMAIL EXISTS!! ","roles":roles});
						}
						else
						{
							var member = [];
							var membershipNum = randomNoGenerator(100000000, 999999999);//getrandomMembershipId();
							member.membershipNo = membershipNum;
							member.password = req.body.password;
							member.firstname= req.body.firstname;
							member.lastname= req.body.lastname;
							member.issuedMovies=0;
							member.outstandingMovies=0;
							member.memberType=req.body.memberType;
							member.balanceAmount=0;
							member.roleId=req.body.role;
							member.email = req.body.email;
							member.address = req.body.address;
							member.address2 = req.body.address2;
							member.city = req.body.city;
							member.state = req.body.state;
							member.zip = req.body.zip1;
							member.zipext = req.body.zip2;
							if(member.zipext == "") {
								member.zipext = 0;
							}
							Userdb.insertUser(function(results,err)
							{
								if(err)
								{
									console.log(err);
								}
								else
								{
									
									
									res.render("createmember",{"userDet" : user,"insertedresults":"User details inserted with membership no."+membershipNum,"roles": roles});
									
									
								}
							},member);
						}
					}
				},req.body.email);
			});
		} else {
			res.render("accessdenied");	
		}
	} else {
		res.writeHead(301,
				{Location: "/login"}			
			);
		res.end();
	}
};
	
exports.index = function(req, res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			res.render('index', {userDet : user});
		} else {
			res.render('\\users\\userindex', {"userDet": user});
		}
		
	} else {
		res.writeHead(301,
				{Location: "/login"}			
			);
		res.end();
	}
};


exports.validateLogin = function(req, res){
	//console.log(req.session);
	if(req.session.userdetails == null || req.session.userdetails == "") {	
	  //res.send("respond with a resource");
		console.log("inside Validate Login");
		if(!req.body.hasOwnProperty('membershipNo') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
		}
		
		Userdb.validateLogin(function(err,results){
			if(err){
				console.log(err);
				res.render('login');
		}else if(results.length > 0) {
			//console.log("query result fetched");
		req.session.userdetails = JSON.stringify({userId : results[0].user_id, membershipNo : results[0].membership_no, firstname :  results[0].firstname, lastname : results[0].lastname, issuedMovies : results[0].issued_movies, outstandingMovies : results[0].outstanding_movies, memberTypes : results[0].member_types, balanceAmount : results[0].balance_amount, roleId : results[0].role_id,  roleName : results[0].role_name});
		//console.log(req.session.userdetails);
		if(results[0].role_name == "ADMIN")
		{
			console.log("ADMIN LOGIN");
			/*res.render('index',
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
			
		});*/
			res.writeHead(301,
					{Location: "/"}			
					);
			res.end();
		}
		else {
			console.log("USER LOGIN");
			res.writeHead(301,
					{Location: "/"}			
					);
			res.end();
				}
		} else {
			res.writeHead(301,
					{Location: "/login"}			
					);
				res.end();
			}
		},req.param('membershipNo'),req.param('password'));
	} else {
		res.writeHead(301,
				{Location: "/"}			
			);
		res.end();
	}
};
	
	
exports.listMember = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var members;
			Userdb.selectUsers(function(results, error) {
				members = results;
				//console.log(members);
				res.render("listmember",{"userDet" : user,"members":members});
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


exports.editMember = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var member;
			var memberId = req.params.id;
			Userdb.selectUserById(function(results, error) {
				member = results[0];
				//console.log(member);
					res.render("editmember",{"userDet" : user,"member":member, "editedResults": null});
			},memberId);
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

exports.editMemberSubmit = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var member = [];
			member.firstname= req.body.fname;
			member.lastname= req.body.lname;
			member.memberType=req.body.memType;
			member.email = req.body.email;
			member.address = req.body.address;
			member.address2 = req.body.address2;
			member.city = req.body.city;
			member.state = req.body.state;
			member.zip = req.body.zip1;
			member.zipext = req.body.zip2;
			member.userId = req.body.userId;
		
			Userdb.editUser(function(results, error) {
					res.render("editmember",{"userDet" : user,"member":member,"editedResults": "User edited successfully."});
			},member);
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

exports.deleteMember = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var memberId = req.params.id;
			Userdb.deleteUser(function(results, error) {
				res.writeHead(301,
						{Location: "/listmember"}			
					);
				res.end();
			},memberId);
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

exports.searchMember = function(req, res){
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null && user.roleName == "ADMIN") {
			var members;
			var membershipNum = req.body.membershipNo;
			var firstname= req.body.fname;
			var lastname= req.body.lname;
			var email=req.body.email;
			var city=req.body.city;
			var state=req.body.state;
			var memberType=req.body.memType;
			if(memberType == null) {
				memberType = ""
			}
			var zip1=req.body.zip1;
			var zip2=req.body.zip2;
			
			Userdb.selectUserBySearchCriteria(function(results, error) {
				members = results;
				//console.log(members);
					res.render("listmember",{"userDet" : user,"members":members});
			}, membershipNum, firstname, lastname, memberType, email, city,state, zip1, zip2);
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
 * User related operations.
 */



exports.user = function(req,res) {
	if(req.session.userdetails != null && req.session.userdetails != "") {	
		var user = JSON.parse(req.session.userdetails);
		if(user !=null) {
			var memberId = req.params.id;
			Userdb.selectUserById(function(results,error) {
				var member = null;
				if(results != null && results.length > 0) {
					member = results[0];
					Userdb.selectIssuedMoviesByUser(function(results, error) {
						res.render("\\users\\user",{"userDet":user,"member": member,"movies":results});
					},memberId);
				}
			},memberId);
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
	
	function randomNoGenerator(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function getrandomMembershipId()
	{
		var randomNo = randomNoGenerator(100000000, 999999999);
		console.log("Random Mem ID: " + randomNo);
		Userdb.selectUserByMembershipNo(function(results,err){
			if(err){
				console.log("Err getting userbyMEMNO" + err);
			}
			else
				{
					if(results.length>0)//(results[0].MEMBERSHIP_NO==randomNo)
						{
						 console.log("Membership no found : " + results);
						 getrandomMembershipId();
						}
					else
						return randomNo;
				}
			
		}, randomNo);
		
	}
