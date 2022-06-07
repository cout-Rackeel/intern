var express = require('express');
var router = express.Router();
var conn = require('../lib/db')
const bcrypt = require('bcrypt')

router.get('/' , (req,res,next) => {
  var locals = {
    title:'Login Page' ,
     stylesheet:''  , 
     bootstrap:false ,
     my_session : req.session
  }
    res.render('login/login' , locals )
})


router.get('/signup' , (req,res,next) => {
  var locals = {
    title:'Sign up Page' ,
     stylesheet:''  , 
     bootstrap:false ,
     my_session : req.session
  }

  res.render('login/signup' , locals)
})

router.post('/add', (req,res,next) => {
  var saltRounds = 10;
  var addSQL = 'INSERT INTO users SET ? ';

  function checkforUserType(){
    var usertype;

    if(req.body.email === 'admin@mail.com'){
      usertype = 'admin';
    }else{
      usertype = 'user';
    }

    return usertype;
  }

  bcrypt.hash(req.body.password, saltRounds, (err,hash) => {
    var data = {email:req.body.email, password : hash , usertype: checkforUserType() }
    conn.query(addSQL, data , (err,rows) => {
      if (err) throw err;
      req.flash('success', 'Sign In successful!');
      res.redirect('/')
    })
  })
 
})

router.post('/authlogin', (req,res,next) => {
  var loginSQL = 'SELECT * FROM users WHERE email = ?'  ;
  conn.query(loginSQL , req.body.email ,(err,rows) => {
    if(rows.length <= 0){
      req.flash('error', 'Invalid credentials');
      req.session.email = req.body.email;
      res.redirect('/login');
    }else{
      bcrypt.compare(req.body.password , rows[0].password, (err,result) =>{
        if(result){
          req.flash('success', 'Welcome ' + req.body.username);
          req.session.loggedIn = true;
          req.session.usertype = rows[0].usertype;
          req.session.userID = rows[0].id;
          req.session.email = req.body.email;
          req.session.password = req.body.password ;
          res.redirect('/');
        }else{
          req.flash('error' , 'Password incorrect');
          req.session.email = req.body.email;
          res.redirect('/login')
        }
      })
    }
   
  })
})


router.get('/logout' , (req,res) => {
  req.session.destroy()
  res.redirect('/');
})


module.exports = router;