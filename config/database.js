var mysql= require('mysql');

//For online database on aws server

// module.exports={
//  'connection':   {
				      
// 				      host:"concrete.czu4q09peyku.us-east-2.rds.amazonaws.com",
// 				      user:"chitransh",
// 				      password:"mission1",
// 				      database:"concrete"
				      
//                  }
// };
console.log("database");


//For local host


module.exports={
  
  'connection': {    host:"localhost",
                   	user:"root",
        			 password:"abhi",
      				database:"messmanager"
            }

};