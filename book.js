var book = function (){  
	var self = this;
	var utilRecurse = require("./utils.js");
	var util = new utilRecurse();

	var bookFile ="books.json";
	var authorFile = "authors.json";

	self.getBooks =function (req,res){
		util.readFile(bookFile,function(data){
			res.end(data.toString())
		});
	};

	self.getBookById = function (req,res){
		var id = req.params.id;
		util.findById(bookFile,id,function (book){
			util.findById(authorFile,book.author,function (author){
				book.author = author.name;
				res.end(JSON.stringify(book));
			})
		})
	};

	self.postBook = function (req,res){
		var form = req.body;
		util.readFile(bookFile, function (data) {
			var fileBooks = JSON.parse(data);
			util.readFile(authorFile,function (data){
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
	};

	self.putBook = function (req,res){
		var id = req.params.id;
		var obj = req.body;
		util.readFile(bookFile,function (data){
			var fileBooks = JSON.parse(data);
			fileBooks.find(function (book) {
				if (id == parseInt(book.id)){
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
	};

	self.deleteBook = function (req,res){
	  var id = req.params.id;
	  util.deleteElemById(bookFile,id,function(objs){
		fileBooks = JSON.stringify(fileBooks);
		fs.writeFile(bookFile,fileBooks);
	  })
	  res.end(JSON.stringify(id));
	}

};
module.exports = book;