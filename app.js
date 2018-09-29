var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets'));
//app.use(express.static(path.join(__dirname,'/assets')));


app.use(express.static(path.join(__dirname,'/img')));
app.use(express.static(path.join(__dirname,'/css')));
app.use(express.static(path.join(__dirname,'/js')));
//app.use(express.static(path.join(__dirname,'views','/')));
app.use(express.static(path.join(__dirname,'/public')));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/menu', function(req, res,next){
  res.render('menu',{submitted:null});
})




// app.get('/login', function(req, res){
//    console.log("here1");
//   res.render('login.ejs',{success:null});
// })

app.get('/', function(req, res){

  res.render('login.ejs', {success:null});

});


app.get('/logout', function(req, res){
   console.log("logout successfull");
   req.session.destroy(function(err){
   console.log("session destroyed");
    if(err)
    {
      console.log("error in destroying session");
      req.negotiate(err);
    }
   })
  res.render('login.ejs',{success:null});
})


app.use('*', function(req, res){

  console.log('* called');
   res.render('login.ejs',{success:null});

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




 // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send(err);
});



module.exports = app;
