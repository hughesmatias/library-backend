var express = require("express");
var app = express();
var port = process.argv[2];
var fs = require("fs");

var bookFile ="books.json";
var authorFile = "authors.json";

var bodyParser = require("body-parser");

var folder = "/home/matias/Documents/workspace/web1/frontend";

app.use(express.static(folder));

app.use(bodyParser.urlencoded({extended: false}));

function readFile(file,callback){
	fs.readFile(file,function (err,data){
		callback(data);
	});
}

function findById(file,id,callback){
	readFile(file,function(data){
		objs = JSON.parse(data);
		var obj = objs.find(function(obj){
			return obj.id == id;
		})
		callback(obj);
	})
}

app.get("/books",function (req,res){
	readFile(bookFile,function(data){
		res.end(data.toString())
	})
});


app.get("/books/:id",function (req,res){
	var id = req.params.id;
	findById(bookFile,id,function (book){
		fs.readFile(authorFile,function (err,data){
			var authors = JSON.parse(data);
			var author = authors.find(function (author){
				return book.author == author.id;
			});
			book.author = author.name;
			res.end(JSON.stringify(book));
		})
	})
});

app.post("/books",function (req,res){
	var form = req.body;
	fs.readFile(bookFile, function (err, data) {
		if (err) throw err;
		var fileBooks = JSON.parse(data);
		fs.readFile(authorFile,function (err,data){
			authorsObj = JSON.parse(data);
			var author = authorsObj.find(function(author){
				return author.name == form.author;
			})
			var newId = fileBooks[fileBooks.length-1].id;
			newId = parseInt(newId) +1;
			form["author"]= author.id;
			form["id"] = JSON.stringify(newId);
			fileBooks.push(form);
			fileBooks = JSON.stringify(fileBooks);
			fs.writeFile(bookFile,fileBooks);
		})
	});

	res.end(JSON.stringify(form));
});

app.put("/books/:id",function (req,res){
	var id = req.params.id;
	var obj = req.body;
	fs.readFile(bookFile,function (err,data){
		var fileBooks = JSON.parse(data);
		fileBooks.find(function (book) {
			if (id == book.id){
				fs.readFile(authorFile,function (err,data){
					var authorsObj = JSON.parse(data);
					var author = authorsObj.find(function (author){
						return obj.author == author.name
					})
					book.title = obj.title;
					book.author = author.id;
					book.description = obj.description;
					book.pagesAmount = obj.pagesAmount;
					fileBooks = JSON.stringify(fileBooks);
					fs.writeFile(bookFile,fileBooks);
				})
			}
		})
		res.end(JSON.stringify(obj));
	})
});


app.delete("/books/:id", function (req,res){
  var id = req.params.id;
  fs.readFile(bookFile, function (err,data){
  	if (err) throw err;
	  var fileBooks = JSON.parse(data);
		fileBooks.forEach(function (book, index) {
			if (book.id == id){
				fileBooks.splice(index,1);
			}
		});
		fileBooks = JSON.stringify(fileBooks);
		fs.writeFile(bookFile,fileBooks);
  })
  res.end(JSON.stringify(id));
});

app.get("/authors",function (req,res){
	readFile(authorFile,function (data){
		res.end(data.toString())
	})
});

app.get("/authors/:id",function (req,res){
	var id = req.params.id;
	findById(authorFile,id,function (data){
		res.end(JSON.stringify(data));
	})
});

app.post("/authors",function (req,res){
	var obj = req.body;
	fs.readFile(authorFile, function(err,data){
		var fileAuthors = JSON.parse(data);
		var newId = fileAuthors[fileAuthors.length-1].id;
		obj["id"] = parseInt(newId) +1;
		obj["id"] = JSON.stringify(obj["id"]);
		fileAuthors.push(obj);
		fs.writeFile("authors.json",JSON.stringify(fileAuthors));
		res.end(JSON.stringify(obj));
	})
});

app.put("/authors/:id",function (req,res){
	var id = req.params.id;
	var objAuthor = req.body;
	fs.readFile(authorFile,function(err,data){
		var authorsObj = JSON.parse(data);
		authorsObj.find(function(obj){
			if(obj.id == id){
				obj.name = objAuthor.name;
			}
		})
		authorsObj = JSON.stringify(authorsObj);
		fs.writeFile(authorFile,authorsObj);
	})
	res.end(JSON.stringify(objAuthor));
});

function deleteElemById(file,comp,id,callback){
	readFile(file,function(objFile){
		deleteElement(JSON.parse(objFile),comp,id,callback) 
	})
}
function deleteElement(objs,comp,id,callback){
	objs.forEach(function(obj,index){
		if ( id = comp){
			objs.splice(index,1);
		}
	})
	callback(objs);
}

app.delete("/authors/:id",function (req,res){
	var id = req.params.id;
	fs.readFile(authorFile,function (err,data){
		var authorsObj = JSON.parse(data);
		authorsObj.forEach(function (author, index){
			if( id == author.id){
				authorsObj.splice(index,1);
			}	
		})
		authorsObj = JSON.stringify(authorsObj);
		fs.writeFile(authorFile,authorsObj);
	})
	fs.readFile(bookFile,function (err,data){
		var books = JSON.parse(data);
		books = books.filter(function (book) {
			return book.author !== id
		});
		
		fs.writeFile(bookFile, JSON.stringify(books));
	})
	res.end(JSON.stringify(id));
})

app.listen(port)