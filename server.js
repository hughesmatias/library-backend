var express = require("express");
var app = express();
var port = process.argv[2];

var bookRecurse = require("./book.js");
var book = new bookRecurse();
var authorRecurse = require("./author.js");
var author = new authorRecurse();
var util = require("./utils.js");

var bodyParser = require("body-parser");

var folder = "/home/matias/Documents/workspace/web1/frontend";

app.use(express.static(folder));

app.use(bodyParser.urlencoded({extended: false}));

app.get("/books", book.getBooks);

app.get("/books/:id", book.getBookById);

app.post("/books", book.postBook);

app.put("/books/:id", book.putBook);

app.delete("/books/:id", book.deleteBook);

app.get("/authors", author.getAuthor);

app.get("/authors/:id", author.getAuthorById);

app.get("/authorsall", author.getAuthorsByName);

app.post("/authors", author.postAuthor);

app.put("/authors/:id",author.putAuthor);

app.delete("/authors/:id", author.deleteAuthor)

app.listen(port)