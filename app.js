//jshint version: 6

const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app  = express();
app.use(express.static("static"))
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

const apiURL = "https://serene-ridge-19523.herokuapp.com/";
let totalinlibrary = 0;
let insidemorethanone = 0;
let firsttime = 0;
let totalregistered = 0;

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
    res.redirect("/admin");
    //res.render("admin",{laststatus: "Entry"});
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
  res.redirect("about");
})

app.get("/admin",function(req,res){


    https.get(apiURL,function(response){  
      console.log(response.statusCode);

      
      totalregistered = 0;
      totalinlibrary = 0;
      insidemorethanone = 0;
      firsttime = 0;
      
      response.on("data", function(data){
        data = JSON.parse(data);  //Here we receive the data from the API - of all the students
        data.forEach(person => {
          totalregistered+=1;

          if(person.laststatus === "Entry"){
            totalinlibrary+=1;
          }

          let timeinsidehour = 0;
          if(person.laststatus === "Entry" && timeinsidehour > 1){
            insidemorethanone+=1;
          }

          if(person.entry != "" && person.entry.split(",").length === 1){
            firsttime+=1;
          }

        });
        res.render("admin",{laststatus: "", totalinlibrary: totalinlibrary, insidemorethanone: insidemorethanone, firsttime: firsttime, totalregistered: totalregistered});
      }); 
    });
});

app.post("/admin", (req,res) => {
  const requestedRoll = req.body.roll;
  https.get(apiURL + "roll/" + requestedRoll, function(response){
        response.on("data", function(data){
        data = JSON.parse(data);
        res.render("admin",{laststatus: data.laststatus, totalinlibrary: totalinlibrary, insidemorethanone: insidemorethanone, firsttime: firsttime, totalregistered: totalregistered});
      });
    
  });

});

app.listen(3000, () => {
  console.log("Server Running on localhost:3000")
})
