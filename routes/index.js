var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var jwt = require('jsonwebtoken');
const secret = "supersecretkey";
var bcrypt = require('bcrypt');

    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/signup',function(req,res,next){
   var name=req.body.name;
   var contact=req.body.contact;
   var collegeName=req.body.collegeName;
   var password=req.body.password;
   var email=req.body.email;
   console.log(req.body);
  bcrypt.hash(password, 10, function(err, hash){
        if(err)throw err;
        password = hash;
        
            if(err){
                return handleError(err, null, res);
            }
            else{
               

 connection.connect(function(err){

   
   var sql="Insert into user ( name , email , contact ,  password , collegeName) values('"+name+"','"+email+"','"+contact+"','"+password+"','"+collegeName+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
     else{

     	res.json({
     		msg:"user created"
     	})
     }

       })
    });
   }
});
});


router.post('/login',function(req,res,next){

    var username=req.body.email;
    var password=req.body.password;


       
        console.log(username, password);
       
           connection.connect(function(err){
          
		    console.log("Connected from login");
		    //console.log("select * from user where email='"+username+"'");
		    connection.query("select *  from user where email='"+username+"'",function(err,result,fields){
		     if(err)
		     {
		     	console.log(err);
                return handleError(err, null, res);
             }

               console.log(result);

		     if(result.length<=0)
		     {
                console.log("user with username : " + username + " not found");
                msg = "user with this username does not exist";
                return handleError(null, msg, res);
            }
            
                 bcrypt.compare(password, result[0].password , function(err, isMatch){
			       if(err){
                    return handleError(err, null, res);
                }
                if(!isMatch){
                    return handleError(null, "wrong password", res);
                }

                jwt.sign({id: result[0].userId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                   // return getAllUserDashboardDetails(req, res, result[0].userId, token);
                   res.json({
                   	success:true,
                   	token:token
                   })
                    
                })
			       
              });

        });

    });
 })




//this function is a general error handler
function handleError(err, msg, res){
    console.log(err);
    if(msg == undefined){
        msg = "there was some error at the server";
    }
    return res.json({
        success:false,
        msg: msg,
        err:err
    });
}
module.exports = router;
 