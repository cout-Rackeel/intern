var express = require('express');
var router = express.Router();
var conn =  require('../lib/db');



function countInterns(callback){
  var countIntern ='SELECT COUNT(i.id) As internCount FROM interns.interns i'
  conn.query( countIntern , (err,rows) => {
    if(err) throw err;
    return callback(rows[0].internCount);
  })
}




router.get('/',(req,res,next) => {
  
  if(req.session.loggedIn){
   
      var locals = {
        title : 'Interns Page - WebTurns.io',
        stylesheet : '/stylesheets/index',
        bootstrap : true,
        my_session : req.session,
      }
      res.render('interns/interns' , locals)

  }else{
    res.redirect('/login')
  }
 
})

router.get('/mydata/:id', (req,res,next) => {
  // var getInternSQL = "SELECT ia.intern_id , i.f_name AS intern_fname , i.l_name AS intern_lname , ta.area_nm, s.session , ta.hourly_rate FROM interns.interns_appointment ia , interns.interns i , interns.mentor_training_areas mta , interns.sessions s,interns.users u,  interns.mentors m , interns.training_areas ta WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id AND i.user_id = u.id AND u.id = '"+req.params.id+"'"

 var getInternSQL = "SELECT ia.intern_id , i.f_name AS intern_fname , i.l_name AS intern_lname, ta.area_nm, s.session , SUM(s.hours)As tot_hours,  ta.hourly_rate * SUM(s.hours) as daily_rate FROM interns.interns_appointment ia , interns.interns i , interns.users u, interns.mentor_training_areas mta , interns.sessions s, interns.mentors m , interns.training_areas ta WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id AND i.user_id = u.id AND u.id = '"+req.params.id+"' GROUP BY ta.hourly_rate"

  function countSessions(callback){
    var countSession ="SELECT COUNT(s.session) As tot_session FROM interns.interns_appointment ia , interns.interns i , interns.mentor_training_areas mta , interns.sessions s, interns.mentors m , interns.training_areas ta , interns.users u WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id AND i.user_id = u.id AND u.id = '"+req.params.id+"' GROUP BY i.f_name"

    conn.query( countSession , (err,rows) => {
      if(err) throw err;
      return callback(rows[0].tot_session);
    })
  }

  function averageHours(callback){
    var averageHours ="SELECT AVG(s.hours) As avg_hours FROM interns.interns_appointment ia , interns.interns i , interns.mentor_training_areas mta , interns.sessions s, interns.mentors m , interns.training_areas ta , interns.users u WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id AND i.user_id = u.id AND u.id = '"+req.params.id+"' GROUP BY i.f_name"
    conn.query( averageHours , (err,rows) => {
      if(err) throw err;
      return callback(rows[0].avg_hours);
    })
  }

  // Function Calls
   countSessions(function(result){
    return sessionsCount = result;
   })

   averageHours(function(result){
    return hoursAverage = result;
   })

   // Render Section

  if(req.session.loggedIn){
    conn.query(getInternSQL , (err,rows) => {

  

      function totalWages(){
        var total_wages = 0;
        rows.forEach(row => {
         total_wages += parseFloat(row.daily_rate);
        });
        return total_wages;
      }

        var locals = {
          title : 'Interns Page - WebTurns.io',
          stylesheet : '/stylesheets/index',
          bootstrap : true,
          my_session : req.session,
          data:rows,
          tot_session: sessionsCount,
          avg_hours : hoursAverage,
          tot_wages : totalWages(),
        }
        res.render('interns/interns' , locals)
    })
  }
})






router.get('/interns-all',(req,res,next) => {
  
  if(req.session.loggedIn && req.session.usertype == 'admin'){
    var internSQL = "SELECT i.user_id,  i.id , i.f_name , i.l_name , u.email " +
    " FROM interns.interns i , interns.users u" +
    " WHERE i.user_id = u.id"

    countInterns(function(result){
     return internsCount = result;
    })
  
    conn.query(internSQL , (err,rows) => {

      var locals = {
        title : 'Interns Page - WebTurns.io',
        stylesheet : '/stylesheets/index',
        bootstrap : true,
        my_session : req.session,
        data:rows,
        interns : internsCount
      }
      if(internsCount){
        res.render('interns/interns-all' , locals)
      }else{
        res.render('loading' , locals)
      }
      
    })

  }else{
    res.redirect('/login')
  }
 
})

router.get('/interns-all/edit/:id' , (req,res,next) => {
  if(req.session.loggedIn && req.session.usertype == 'admin'){

    var editSQL = "SELECT i.user_id,  i.id , i.f_name , i.l_name , u.email " +
    " FROM interns.interns i , interns.users u" +
    " WHERE i.user_id = u.id AND u.id =" + req.params.id 

    conn.query(editSQL , (err,rows) =>{
      var locals = {
        title : 'Interns Edit Page - WebTurns.io',
        stylesheet : '/stylesheets/index',
        bootstrap : true,
        my_session : req.session,
        data:rows[0],
      }
      res.render('interns/interns-edit' , locals)
    })


  }else{
    res.redirect('/login')
  }
})






router.post('/update' , (req,res,next) => {
  var userSQL = "UPDATE interns.users SET email ='" + req.body.email + 
  "' WHERE id = " + req.body.user_id
  var internSQL = "UPDATE interns.interns SET f_name ='" + req.body.f_name + 
  "',l_name ='" + req.body.l_name + 
  "' WHERE interns.user_id = " + req.body.user_id

  function updateUsers(callback){
    conn.query(userSQL,(err,rows) => {
      conn.query(internSQL,(err,rows) =>{
        req.flash('success','Succeed');
        res.redirect('/interns/interns-all/')
      })
      return callback;
    })
  }
  
  updateUsers(function(result){
    
  })

  

})




module.exports = router;