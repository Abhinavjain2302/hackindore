var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var jwt = require('jsonwebtoken');
 var secret="supersecret";
var bcrypt = require('bcrypt');

    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);



/* GET home page. */
// router.get('/', function(req, res, next) {
//   console.log("here");
//   //res.render('login');
//   return res.render('login',{success:null});
// });


router.post('/signup1',function(req,res,next){
   var name=req.body.name;
   var contact=req.body.contact;
   var collegeName=req.body.collegeName;
   var password=req.body.password;
   var email=req.body.email;
   var userType='student';
   console.log(req.body);
  bcrypt.hash(password, 10, function(err, hash){
        if(err)throw err;
        password = hash;
        
            if(err){
                return handleError(err, null, res);
            }
            else{
               

 connection.connect(function(err){

   
   var sql="Insert into user ( name , email , contact ,  password , collegeName,userType) values('"+name+"','"+email+"','"+contact+"','"+password+"','"+collegeName+"','"+userType+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
     else{

     	// res.json({
     	// 	msg:"user created"
     	// })
      res.render('login');
     }

       })
    });
   }
});
});


router.post('/signup2',function(req,res,next){
  
   var ownerName=req.body.ownerName;
   var contact=req.body.contact;
   var collegeName=req.body.collegeName;
   var password=req.body.password;
   var email=req.body.email;
   var messName=req.body.messName;
   var userType='student'
   
   console.log(req.body);
  bcrypt.hash(password, 10, function(err, hash){
        if(err)throw err;
        password = hash;
        
            if(err){
                return handleError(err, null, res);
            }
            else{
               

 connection.connect(function(err){

   
   var sql="Insert into admin ( ownerName , email , contact ,  password , collegeName, messName ,userType) values('"+ownerName+"','"+email+"','"+contact+"','"+password+"','"+collegeName+"','"+messName+"','"+userType+"')";
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
               return  res.render('login',{success:false,msg:'There was some error' });
            }
            else{
            console.log(result[0].collegeName);
             connection.query("select *  from admin where collegeName='"+result[0].collegeName+"'",function(err,results,fields){
                   if(err) throw err;
              console.log(results);
                

                 bcrypt.compare(password, result[0].password , function(err, isMatch){
			       if(err){
                    return  res.render('login',{success:false,msg:'There was some error' });
                }
                if(!isMatch){
                   return  res.render('login',{success:false,msg:'There was some error' });
                }

                jwt.sign({id: result[0].userId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                   // return getAllUserDashboardDetails(req, res, result[0].userId, token);
                   // res.json({
                   // 	success:true,
                   // 	token:token
                   // })
                   console.log("inside jwt");
                
                  return res.render("index",{result:results});
                    
                })
			       
               });
             });
             }
        });

    });
 })



router.get('/profile',function(req,res,next){

console.log(req.session.token);

  jwt.verify(req.session.token, secret, function(err, decoded){
//  jwt.verify(req.headers.authorization, secret, function(err, decoded){
  if(err){
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
    console.log(userId);
    console.log(decoded);

    //User.findOneById(userId, function(err, user){
      
      connection.connect(function(err){
   
    console.log("Connected form profile");
    connection.query("select * from user where userId='"+userId+"'",function(err,results,fields){
   if(err) throw err;


  res.render('user-profile',{user:results});       
             

    })
  })
})

});


router.post('/profile',function(req,res,next){

 console.log(req.session.token);
     jwt.verify(req.session.token, secret, function(err, decoded){

    if(err){
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
    var id = userId;
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var collegeName = req.body.collegeName;
   
    console.log(req.body.name);
    console.log(name);

           connection.connect(function(err){
  
            console.log("Connected from post profile");
      
            var sql="update user SET name='"+name+"', email='"+email+"',contact='"+contact+"',pan='"+pan+"',gstin='"+gstin+"' where userId='"+id+"'";
           connection.query(sql,function(err,result,fields){
        
            if(err)
            {
            handleError(err, 'error updating user details', res);
            return;
            }
           
           res.redirect('../users/profile');

    
      })
    })
    
  })

})


router.post('/changepass',function(req,res,next){
 var oldpass = req.body.oldpass;
  var newpass = req.body.newpass;
  var newpass2 = req.body.newpass2;

console.log(req.session.token);
  jwt.verify(req.session.token, secret, function(err, decoded){
  if(err){
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId = decoded.id;

 
    
    connection.connect(function(err){
    console.log("Connected from changepass");
    connection.query("select * from user where userId='"+userId+"'",function(err,result,fields){



      if(err){
        handleError(err, '', res);
        return;
      }
      bcrypt.compare(oldpass, result[0].password, function(err, match) {
        if(!match){
        
            return res.render('update-password',{success:false,msg:'old password is not correct'});
        }
        if(newpass != newpass2){
        
          return res.render('update-password',{success:false,msg:'passwords do not match'});
        }
        bcrypt.hash(newpass, 10, function(err, hash){
          if(err){
            handleError(err, '', res);
            return;
          }
          result[0].password = hash;
            connection.query("update user SET password='"+result[0].password+"' where userId='"+userId+"'",function(err,result,fields){
            if(err) throw err;
          
            res.render('update-password',{success:true,msg:'Password Updated successfully'});
        });
      });
    })
  });
});
});
})


router.post('/upload',function(req,res,next){

 console.log(req.session.token);
     jwt.verify(req.session.token, secret, function(err, decoded){

    if(err){
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
    var id = userId;
     var array=req.body.array;
   
 console.body(array);

           connection.connect(function(err){
  
            console.log("Connected from upload");
      
            var sql="update user SET name='"+name+"', email='"+email+"',contact='"+contact+"',pan='"+pan+"',gstin='"+gstin+"' where userId='"+id+"'";
           connection.query(sql,function(err,result,fields){
        
            if(err)
            {
            handleError(err, 'error updating user details', res);
            return;
            }
           
           res.redirect('../users/profile');

    
      })
    })
    
  })

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
 