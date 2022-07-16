//jshint version: 6

const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');

const app  = express();
app.use(express.static("static"))
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

app.get("/", (req,res)=>{
  res.render("index");
})

app.get("/login",(req,res)=>{
  //res.sendFile(__dirname + "/login.html")
  res.render("login", {tryAgain: ""});
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  if(email == 'admin@admin' && password == "admin"){
    //res.sendFile(__dirname + "/success.html");
    res.render("success")
  }
    else{
      console.log("LOGIN FAILED");
      res.render("login", {tryAgain: "Invalid login! Please try again."});
    }
})

app.get("/about", (req,res) => {
  //res.sendFile(__dirname + "/about.html");
  res.render("about")
})

app.get("/developmentTeam", (req,res) =>{
  //res.sendFile(__dirname + "/developmentTeam.html");
  res.render("about");
})

app.listen(3000, () => {
  console.log("Server Running on localhost:3000")
})
