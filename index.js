const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/booksDB", {
  useNewUrlParser: true
});

app.get("/", function(req, res) {
  res.render("index");
});


const booksSchema = new mongoose.Schema({
  bookname: String,
  sellp: Number,
  name: String,
  bookd: String,
  contact: String
});

const Book = mongoose.model("Book", booksSchema);

app.get("/items", function(req, res) {
  Book.find({}, function(err, foundBooks) {

    if (foundBooks.length === 0) {
      console.log("No Books Added")
      res.redirect("/");
    } else {
      Book.find({}, null, {   //to sort alphabetically
        sort: {
          bookname: 1
        }
      }, function(err, foundBooks) {
        if (!err) {
          res.render("items", {

            newBookItems: foundBooks
          });
        }
      });
    }
  });
});

app.get("/add", function(req, res) {
  res.render("additem");
});

app.post("/add", function(req, res) {
  const book = new Book({
    bookname: req.body.bookname,
    sellp: req.body.sellp,
    name: req.body.name,
    bookd: req.body.bookdetails,
    contact: req.body.contact
  });
  book.save();
  res.redirect("/items");


});

app.get("/items/:bookid", function(req, res) {
  const bookid = req.params.bookid;
  Book.findOne({
    _id: bookid
  }, function(err, foundBook) {
    if (!err) {
      res.render("book", {
        bookname: foundBook.bookname,
        sellp: foundBook.sellp,
        name: foundBook.name,
        bookdetails: foundBook.bookd,
        contact: foundBook.contact
      });
    }

  });
});

app.get("/info", function(req,res){
  res.render("info");
})
app.get("/contact", function(req,res){
  res.render("contact");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
