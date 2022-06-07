var express = require('express');
var router = express.Router();
var conn =  require('../lib/db');

router.get('/',(req,res,next) => {

  var appointSQL = "SELECT ia.id , i.f_name AS intern_fname , i.l_name AS intern_lname  , m.f_name AS trainer_fname , m.l_name AS trainer_lname, ta.area_nm , s.session , mta.trn_area_id As area_id" +
  " FROM interns.interns_appointment ia , interns.interns i , " +
  " interns.mentor_training_areas mta , interns.sessions s, " +
  " interns.mentors m , interns.training_areas ta" + 
  " WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id" + 
  " AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id "
  
  conn.query( appointSQL , (err,rows) => {
    if(err) throw err
    
    if(req.session.loggedIn){

      var locals = {
        title : 'Appointments- WebTurns.io',
        stylesheet : '/stylesheets/index',
        bootstrap : true,
        my_session : req.session,
        data: rows
      }
     
      res.render('appointments/appointments' , locals)
  
    }
  }) 
})


router.get('/edit/:id' , (req,res,next) => {
  var editSQL = "SELECT ia.id , i.f_name AS intern_fname , i.l_name AS intern_lname  , m.f_name AS trainer_fname , m.l_name AS trainer_lname, ta.area_nm , s.session  , mta.trn_area_id As area_id , mta.session_id As sess_id" +
  " FROM interns.interns_appointment ia , interns.interns i , " +
  " interns.mentor_training_areas mta , interns.sessions s, " +
  " interns.mentors m , interns.training_areas ta" + 
  " WHERE mta.mentor_id = m.id AND mta.trn_area_id = ta.id AND mta.session_id = s.id" + 
  " AND ia.intern_id = i.id AND ia.mentor_trn_id = mta.id AND ia.id = " + req.params.id;

  conn.query(editSQL , (err,rows) => {
    if(err) throw err

    if(req.session.loggedIn && req.session.usertype == 'admin'){
      var locals = {
        title : 'Appointments- WebTurns.io',
        stylesheet : '/stylesheets/index',
        bootstrap : true,
        my_session : req.session,
        data: rows[0]
      }
      res.render('appointments/appointments-edit', locals);
    }else{
      req.flash('error' , 'You dont not have access to this page')
      res.redirect('/')
    }
  
  })
 
})

router.post('/edit-data' , (req, res, next) => {
  var insertSQL = " INSERT INTO  "
  "UPDATE interns_appointment SET meal_opt_id ='" + req.body.option + 
                                      "',trainee_id ='" + req.body.traineeId + 
                                      "', date ='" + req.body.date + 
                                      "' WHERE id = " + req.body.lunchId;

})

module.exports = router;

