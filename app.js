const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const multer = require('multer');
const contracterModel = require('./contracters');
const app = express()

mongoose.connect("mongodb://localhost:27017/sepmLab", {useNewUrlParser: true,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs")
app.use(express.static("public"))

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    passward: String
});
const userData = mongoose.model("user", userSchema);

const bankSchema = new mongoose.Schema({
  name: String,
  branch: String,
  hdfcCode: String,
  offer: String
});
const banks = mongoose.model("banks",bankSchema);

var contractStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: contractStorage });

app.get("/",(req,res)=>{
  res.render("index");
});
app.get("/aboutUs",(req,res)=>{
  res.render("aboutUs");
});

app.get("/sign-up",(req,res)=>{
  res.render("signup");
});

app.post("/sign-up",(req,res)=>{
  var k=0;
  userData.find({},(err,users)=>{
    console.log("In here");
    console.log(k);
    for(var i=0;i<users.length;i++){
      if(users[i].username===req.body.username){
        k=1;
        console.log(k);
        res.redirect("/sign-up");
        break;
    }
  }
  console.log(k);

  });

  setTimeout(() => { console.log("World!");
  if(k===0){
    console.log(k);
    console.log("k not working");
    var phoneno = /^\d{10}$/;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if((re.test(String(req.body.username).toLowerCase()) ||  /^\d{10}$/.test(req.body.username)) && req.body.passward === req.body.Rpassward){
      let userdata= new userData({
        name: req.body.username,
        username: req.body.username,
        passward: req.body.passward
      })
      userdata.save(err=>{
        console.log(err);
      })

      res.redirect("/log-in");
      console.log(k);
    }else{
        res.redirect("/sign-up");
    }
  }
}, 2000);
});


app.get("/log-in",(req,res)=>{
    res.render("logIn")
});
app.post("/log-in",(req,res)=>{
    var k=true;
    var query = {username: req.body.username}
    console.log(query);
    userData.find({},(err,user)=>{
      console.log("Hi");
      for(var i=0;i<user.length;i++){
        console.log("lelele");
        if(user[i].username===req.body.username && user[i].passward===req.body.password){
          res.redirect("/");
          console.log("here");
          k=false
          break;
      }
    }

    })
    setTimeout(() => {
      if(k){
        res.redirect("/log-in")
      }},2000)

})

app.get("/add-bank",(req,res)=>{
    res.render("add-bank")
});
app.post("/add-bank",(req,res)=>{
  let bank= new banks({
    name: req.body.bankName,
    branch: req.body.branch,
    hdfcCode: req.body.hdfcCode,
    offer: req.body.offer
  });
  bank.save(err=>{
    console.log(err);
    res.redirect("/add-bank");
  });

  res.redirect("/banks");

});
app.get("/banks",(req,res)=>{
  banks.find({},(err,banks)=>{
    res.render("banks-list",{
      banks: banks
    });
  });
});

app.get("/contract-farming",function(req,res){
  contracterModel.find({},function(err,contracts){
      res.render("contract-farming",{
        contracters: contracts
      });
    });
  });

app.get("/add-contract-details",function(req,res){
  res.render("addContract");
});
app.post('/add-contract-details', upload.single('image'), (req, res, next) => {

    var obj = new contracterModel({
        name: req.body.name,
        crop: req.body.crop,
        requirnemt: req.body.requirnemt,
        email: req.body.email,
        amount: req.body.amount,
        comments: req.body.comments,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    obj.save( err=>{
      if(!err){
        res.redirect("/contract-farming");
      }else{
        console.log(err);
      }
    })
});

app.get("/contact-us",(req,res)=>{
  res.render("contactUs")
})
var port = process.env.PORT || 3000
app.listen(port, function(){
  console.log("Server is liatening on port 3000");
});
