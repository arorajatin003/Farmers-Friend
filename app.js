const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const multer = require('multer');
const contracterModel = require('./contracters');
const app = express()

mongoose.connect("mongodb+srv://Jatin-arora-admin:Jatinarora003@cluster0.osicw.mongodb.net/sepmLab", {useNewUrlParser: true,useUnifiedTopology: true});
// mongodb://localhost:27017/
//mongodb+srv://Jatin-arora-admin:Jatinarora003@cluster0.osicw.mongodb.net/sepmLab

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
  if(req.body.passward === req.body.Rpassward){
    let userdata= new userData({
      name: req.body.username,
      username: req.body.username,
      passward: req.body.passward
    })
    userdata.save(err=>{
      console.log(err);
    })

    res.redirect("/log-in");
  }else{
    res.redirect("/signup");
  }
});


app.get("/log-in",(req,res)=>{
    res.render("logIn")
});
app.post("/log-in",(req,res)=>{
    userData.find({},(err,user)=>{
      console.log(user);
    })
    var query = {username: req.body.username}
    console.log(query);
    userData.find({query},(err,user)=>{
      console.log(user);

    })
    res.redirect("/")
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

app.listen(3000, ()=>{
  console.log("Server is listening on port 3000");
})
