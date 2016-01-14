(function(module){

module.getBooks = function (req,res){
	fs.readFile(file,function (err,data){
		res.end(data.toString());
	});
}

module.getBook = function (req,res){
	var id = req.params.id;
	fs.readFile(file,function (err,data){
		var books = JSON.parse(data);
		var book = books.find(function (book) {
			return book.id == id
		})
		res.end(JSON.stringify(book));
	})
}

module.postBook = function (req,res){
	var form = req.body;
	fs.readFile(file, function (err, data) {
	  if (err) throw err;
	  var fileBooks = JSON.parse(data);
	  var newId = fileBooks[fileBooks.length-1].id;
	  newId = newId +1;
	  form["id"] = JSON.stringify(newId);
	  fileBooks.push(form);
	  fileBooks = JSON.stringify(fileBooks);
	  fs.writeFile(file,fileBooks);
	});

	res.end(JSON.stringify(form));
}

module.putBook = function (req,res){
	var id = req.params.id;
	var obj = req.body;
	fs.readFile(file,function (err,data){
		var fileBooks = JSON.parse(data);
		fileBooks.find(function (book) {
			if (id == book.id){
				book.title = obj.title;
				book.author = obj.author;
				book.description = obj.description;
				book.pagesAmount = obj.pagesAmount;
			}
		})
		fileBooks = JSON.stringify(fileBooks);
		fs.writeFile(file,fileBooks);
		res.end(JSON.stringify(obj));
	})
}

module.deleteBook = function (req,res){
  var id = req.params.id;
  fs.readFile(file, function (err,data){
  	if (err) throw err;
	  var fileBooks = JSON.parse(data);
		fileBooks.forEach(function (book, index) {
			if (book.id == id){
				fileBooks.splice(index,1);
			}
		});
		fileBooks = JSON.stringify(fileBooks);
		fs.writeFile(file,fileBooks);
  })
  res.end(JSON.stringify(id));
}
}(this.book = {}));