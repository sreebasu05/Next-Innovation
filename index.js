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

mongoose.connect("mongodb://localhost:27017/projectDB", {
  useNewUrlParser: true
});

app.get("/", function(req, res) {
  res.render("index");
});


const booksSchema = new mongoose.Schema({
  bookname: String,
  sellp: Number,
  name: String,
  subject: String,
  year: String,
  condition: String,
  edition: String,
  phone: String,
  email: String,
  time: String,
  hostel: String,
  room: String
  
});

const Book = mongoose.model("Book", booksSchema);

const mailsSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  subject: String,
  message: String
})

const Mail = mongoose.model("Mail", mailsSchema);

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
    subject: req.body.subject,
    year: req.body.year,
    condition: req.body.condition,
    edition: req.body.edition,
    phone: req.body.phone,
    email: req.body.email,
    time: req.body.time,
    hostel: req.body.hostel,
    room: req.body.room
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
        subject: foundBook.name,
        year: foundBook.year,
        condition: foundBook.condition,
        edition: foundBook.edition,
        phone: foundBook.phone,
        email: foundBook.email,
        time: foundBook.time,
        hostel: foundBook.hostel,
        room: foundBook.room

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
app.post("/contact", function(req, res) {
  const mail = new Mail({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message
  });
  mail.save();
  res.redirect("/");


});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
