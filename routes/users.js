var express = require('express');
var router = express.Router();
const secret = "supersecretkey";
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mysql=require('mysql');

   //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/login',function(req,res,next){

    var username=req.body.email;
    var password=req.body.password;


       
        console.log(username, password);
       
           connection.connect(function(err){
          
		    console.log("Connected from login");
		    //console.log("select * from user where email='"+username+"'");
		    connection.query("select *  from admin where email='"+username+"'",function(err,result,fields){
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






// this api is for sign up for app side

router.post('/signup',function(req,res,next){
  
   var ownerName=req.body.ownerName;
   var contact=req.body.mobile;
   var collegeName=req.body.collegeName;
   var password=req.body.password;
   var email=req.body.email;
   var messName=req.body.messName;
   
   console.log(req.body);
  bcrypt.hash(password, 10, function(err, hash){
        if(err)throw err;
        password = hash;
        
            if(err){
                return handleError(err, null, res);
            }
            else{
               

 connection.connect(function(err){

   
   var sql="Insert into admin ( ownerName , email , contact ,  password , collegeName, messName ) values('"+ownerName+"','"+email+"','"+contact+"','"+password+"','"+collegeName+"','"+messName+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
     else{

      res.json({
      	success:true,
        msg:"user created"
      })
     }

       })
    });
   }
});
});


//api for profile
router.post('/profile',function(req,res,next){

jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

    
        var id = userId;
        var name = req.body.ownerName;
        var email = req.body.email;
        var contact = req.body.mobile;
        var messName = req.body.messName;
        var collegeName = req.body.collegeName;

      

   
            connection.connect(function(err){
		 
		    console.log("Connected form edit profile");
		  
			    var sql="update admin SET ownerName='"+name+"', email='"+email+"',contact='"+contact+"',collegeName='"+collegeName+"',messName='"+messName+"' where adminId='"+id+"'";
			    connection.query(sql,function(err,result,fields){
			   if(err) throw err;

                    if(err){
                        handleError(err, null, res);
                    }
                    res.json({
                        success:true,
                        user:result
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
