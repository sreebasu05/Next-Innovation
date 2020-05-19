const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const app = express();
var favicon = require('serve-favicon');

app.use('/favicon.ico', express.static('/favicon.ico'));
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


const usersSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  password: String,
  email: String,
  books: [booksSchema]
});

const User = mongoose.model("User", usersSchema);

const defaultBooks = [];
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
app.get("/dashboard/:user", function(req, res) {
  const user = req.params.user;
  User.findOne({
    username: user
  }, function(err, foundUser) {
    if (!err) {
      res.render("dashboard", {
        user: user,
        newBookItems: foundUser.books
      });
    }
  });
});
app.post("/delete/:user", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const user = req.params.user;

  Book.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("Success");
    }
  });
  User.findOneAndUpdate({
      username: user
    }, {
      $pull: {
        books: {
          _id: checkedItemId
        }
      }
    },
    function(err, foundList) {
      if (!err) {
        res.redirect("/dashboard/" + user);
      }
    });
});

app.get("/signup", function(req, res) {
  res.render("signup");
});
app.post("/signup", function(req, res) {
  if (req.body.password === req.body.cpassword) {
    const user = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      password: req.body.password,
      email: req.body.email,
      books: defaultBooks

    });
    const u = req.body.username;
    user.save();
    res.redirect("/index/" + u);
  } else {
    console.log("error");
    res.redirect("/signup");
  }
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.post("/login", function(req, res) {
  const user = req.body.username
  User.findOne({
    username: user
  }, function(err, foundUser) {
    if(!err){
      pass=foundUser.password;
    if ( pass === req.body.password) {
      res.redirect("/index/" + user);
    } else {
      console.log("Wrong Password");
      res.render("/index"+user);
    }}
  });
});
app.get("/index/:user", function(req, res) {
  const user = req.params.user;
  User.findOne({
    username: user
  }, function(err, foundUser) {
    res.render("indexB", {
      name: foundUser.fullname,
      user: foundUser.username
    });
  });
});
//




app.get("/add/:user", function(req, res) {
  const user = req.params.user;
  User.findOne({
    username: user
  }, function(err, foundUser) {
    if(!err){
    res.render("additem", {
      user: foundUser.username
    });}
  });
});


app.get("/add", function(req, res) {

  res.render("additem");
});

app.post("/add/:user", function(req, res) {
  const user = req.params.user;
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
  User.findOne({
    username: user
  }, function(err, foundUser) {
    foundUser.books.push(book);
    foundUser.save();
    res.redirect("/dashboard/" + user);
  });
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
