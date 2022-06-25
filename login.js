//jshint version: 6

const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');

const app  = express();
app.use(express.static("static"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/index.html")
})

app.get("/login.html",(req,res)=>{
  res.sendFile(__dirname + "/login.html")
})

app.post("/login.html", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  if(email == 'admin@library.edu' && password == "admin"){
    res.sendFile(__dirname + "/success.html");
  }
})


app.listen(3000, () => {
  console.log("Server Running on localhost:3000")
})
