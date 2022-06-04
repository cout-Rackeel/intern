var express = require('express');
var router = express.Router();
var conn =  require('../lib/db');

router.get('/',(req,res,next) => {
  if (err) throw err;
  
  if(true){
    var locals = {
      title : 'Home Page - WebTurns.io',
      stylesheet : '/stylesheets/index',
      bootstrap : false
    }

    res.render('index' , locals)
  }
 
})

module.exports = router;