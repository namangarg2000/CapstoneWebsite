//jshint version: 6

const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app  = express();
app.use(express.static("static"))
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

const apiURL = "https://ill-pear-badger-wear.cyclic.app/";
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

app.post("/login", (req, res) => {  //email is replaced by roll number in the login page
  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  if(email == '0' && password == "admin"){
    res.redirect("/admin");
    //res.render("admin",{laststatus: "Entry"});
  }
  else{
    let roll = email;
      https.get(apiURL + "roll/" + roll, function(response){
      response.on("data", function(data){
        data = JSON.parse(data);
        console.log(data);
        // console.log("here")
        console.log("Roll:", roll);
        console.log("Password:",data.password);
        if(password === data.password){
          //Check if the user is existing only then redirect to the user page
          res.redirect("/user/" + roll);
        } else {
          console.log("Invalid Login!");
          res.render("login", {tryAgain: "Invalid login! Please try again."})
        }
      });
    });
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

    // https.get(apiURL,function(response){  
    //   console.log(response.statusCode);

      
      
    //   const now = Date.now()
    //   const ONE_HOUR = 3600000;

    //   response.on("data", function(data){
    //     data = JSON.parse(data);  //Here we receive the data from the API - of all the students
    //     data.forEach(person => {
    //       console.log(person);
    //       totalregistered+=1;

    //       // if(person.laststatus === "Entry"){
    //       //   totalinlibrary+=1;
    //       // }

    //       // // if(person.laststatus === "Entry" && (parseFloat(person.entry.split(",")[0]) - now > ONE_HOUR)){
    //       // //   insidemorethanone+=1;
    //       // // }

    //       // if(person.laststatus === "First"){
    //       //   firsttime+=1;
    //       // }

    //     });
    //     res.render("admin",{laststatus: "", totalinlibrary: totalinlibrary, insidemorethanone: insidemorethanone, firsttime: firsttime, totalregistered: totalregistered});
    //   }); 
    //   //res.render("admin",{laststatus: "", totalinlibrary: totalinlibrary, insidemorethanone: insidemorethanone, firsttime: firsttime, totalregistered: totalregistered});
    // });
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

app.get("/user/:roll", (req,res) => {
  https.get(apiURL + "roll/" + req.params.roll, function(response){
    response.on("data", function(data){
      data = JSON.parse(data);
      console.log(data);
      console.log("In user/roll get");
      // console.log(__dirname)

      //convert latest entry and exit to local time and send it to the user page
      let entry = data.entry.split(",")[0];
      let exit = data.exit.split(",")[0];
      
      let d1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d1.setUTCSeconds(entry);

      let d2 = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d2.setUTCSeconds(exit);
      
      console.log("entry:",d1);
      console.log("exit:",d2);

      res.render("user", {roll: data.rollnumber, email: data.email, laststatus: data.laststatus, entry: d1, exit: d2});
    });
  });
});

app.listen(3000, () => {
  console.log("Server Running on localhost:3000")
})
