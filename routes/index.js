var express = require('express');
const { redirect } = require('express/lib/response');
var router = express.Router();
var conn =  require('../lib/db');

router.get('/',(req,res,next) => {
  
  if(req.session.loggedIn){
    var locals = {
      title : 'Home Page - WebTurns.io',
      stylesheet : '/stylesheets/index',
      bootstrap : false,
      my_session : req.session
    }
    res.render('index' , locals)
  }else{
    res.redirect('/login')
  }
 
})

module.exports = router;