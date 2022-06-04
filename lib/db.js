var mysql = require('mysql');

const conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'interns'
})

conn.connect(err => {
  if(!err){
   console.log(`Connected to Database... Thank You Jesus`);
  }else{
   console.log(`Error not connected to Database ... Praise Him anyhow`);
  }
})

module.exports = conn;
