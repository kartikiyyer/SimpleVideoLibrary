var Userdb = require('../util/Users');
var UserInfodb=require('../util/UserInfo');
/*
 * GET users listing.
 */

exports.login = function(req, res){
  //res.send("respond with a resource");
	res.render("login");
};

exports.createmember = function(req, res){
	//var categories = [];
	
	/*// Fetch categories from database
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
		res.render("createmovie",{"insertedresults":null,"categories":categories});
	});*/
	res.render("createmember",{"insertedresults":null});
};

exports.createMemberSubmit = function(req,res) 
{
	//var user = [];
	var userInfo= [];
	var userId;
	
	UserInfodb.getUserInfoByEmail(function(results,err)
	{
		if(err)
		{
			console.log("email err");
			console.log(err);
			res.render("createmember",{"insertedresults":"Email query problem"});
		}else
		{
			if(results.length>0)
			{
				console.log("email query result :" + results);
				res.render("createmember",{"insertedresults":"MEMBER EMAIL EXISTS!! "});
			}
			else
			{
				var user = [];
				var membershipNum = randomNoGenerator(100000000, 999999999);//getrandomMembershipId();
				user.membershipNo = membershipNum;
				user.password = req.body.password;
				user.firstname= req.body.firstname;
				user.lastname= req.body.lastname;
				user.issuedMovies=0;
				user.outstandingMovies=0;
				user.memberType=req.body.memberType;
				user.balanceAmount=0;
				user.roleId=req.body.role;
				Userdb.insertUser(function(results,err)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						Userdb.selectUserByMembershipNo(function(results,err)
						{
							if(err)
							{
								console.log(err);
							}
							else if(results.length>0)
							{
								console.log("USER ID: " + results[0].USERID);
								userId=results[0].USERID;
								userInfo.userId=userId;
								userInfo.emailId=req.body.email;
								userInfo.address=req.body.address;
								userInfo.city=req.body.city;
								userInfo.zip=req.body.zip1;
								userInfo.zipextn=req.body.zip2;
										
								UserInfodb.insertUserInfo(function(results,err)
								{
									if(err)
									{
										console.log(err);
									}
									else
									{
										res.render("createmember",{"insertedresults":results});
									}
								
								},userInfo);
							}
						
						}, membershipNum);
					}
				},user);
			}
		}
	},req.body.email);
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
				console.log(err);
				res.render('login');
			}else{
				//console.log("query result fetched");
				req.session.userdetails = JSON.stringify({userId : results[0].USERID, membershipNo : results[0].MEMBERSHIP_NO, firstname :  results[0].FIRSTNAME, lastname : results[0].LASTNAME, issuedMovies : results[0].ISSUED_MOVIES, outstandingMovies : results[0].OUTSTANDING_MOVIES, memberTypes : results[0].MEMBER_TYPES, balanceAmount : results[0].BALANCE_AMOUNT, roleId : results[0].ROLE_ID});
				//console.log(req.session.userdetails);
				if(results[0].ROLE_ID==1)
				{
					console.log("ADMIN LOGIN");
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
				else if(results[0].ROLE_ID==2)
					{
					console.log("USER LOGIN");
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
			}
		},req.param('membershipNo'),req.param('password'));
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
