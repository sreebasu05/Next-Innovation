
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

const items =[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res){
  res.render("index");
});
app.get("/items", function(req,res){
  res.render("items",{
    title: "Items",
    items: items
  });
})
app.get("/add", function(req,res){
  res.render("additem");
});

app.post("/add", function(req, res) {
  const item = {
    bookname: req.body.bookname,
    sellp: req.body.sellp,
    name: req.body.name,
    bookdetails: req.body.bookdetails,
    contact: req.body.contact
  };
  items.push(item);
  res.redirect("/items");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
