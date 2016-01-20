var author= function(){

	var utilRecurse = require("./utils.js");
	var util = new utilRecurse();

	var bookFile ="books.json";
	var authorFile = "authors.json";
	var fs = require("fs");

	var self = this;
	self.getAuthor = function(req,res){
		util.readFile(authorFile,function (data){
			res.end(data.toString())
		})
	};

	self.getAuthorById = function(req,res){
		var id = req.params.id;
		util.findById(authorFile,id,function (data){
			res.end(JSON.stringify(data));
		})
	};

	self.getAuthorsByName = function(req,res){
		util.readFile(authorFile,function (data){
			var objs = [];
			var json = JSON.parse(data);
			json.forEach(function(obj) {
   				objs.push(obj.name);
			});
			res.end(JSON.stringify(objs));
		})
	};

	// self.getAuthorsByName2 = function(req,res){
	// 	console.log(req.query.q);
	// 	util.readFile(authorFile,function (data){
	// 		var objs = [];
	// 		var json = JSON.parse(data);
	// 		json.forEach(function(obj) {
	// 				objs.push(obj.name);
	// 		});
	// 		objs= objs.filter(function(name){
	// 			var expresion = new RegExp(^name);
	// 			if ( req.query.q == name.match(expresion) ){
	// 				return name
	// 			}
	// 		})
	// 		res.end(JSON.stringify(objs));
	// 	});
	// }

	self.postAuthor = function(req,res){
		var obj = req.body;
		util.readFile(authorFile, function(data){
			var fileAuthors = JSON.parse(data);
			var newId = fileAuthors[fileAuthors.length-1].id;
			obj["id"] = parseInt(newId) +1;
			obj["id"] = JSON.stringify(obj["id"]);
			fileAuthors.push(obj);
			fs.writeFile("authors.json",JSON.stringify(fileAuthors));
			res.end(JSON.stringify(obj));
		})
	};

	self.putAuthor =function(req,res){
		var id = req.params.id;
		var objAuthor = req.body;
		util.readFile(authorFile,function(data){
			var authorsObj = JSON.parse(data);
			authorsObj.find(function(obj){
				if(obj.id == parseInt(id)){
					obj.name = objAuthor.name;
				}
			})
			authorsObj = JSON.stringify(authorsObj);
			fs.writeFile(authorFile,authorsObj);
		})
		res.end(JSON.stringify(objAuthor));
	};

	self.deleteAuthor = function(req,res){
		var id = req.params.id;
		util.deleteElemById(authorFile,id,function(authorsObj){
			authorsObj = JSON.stringify(authorsObj);
			fs.writeFile(authorFile,authorsObj);
		})
		util.readFile(bookFile,function (data){
			var books = JSON.parse(data);
			books = books.filter(function (book) {
				return book.author !== id
			});
			
			fs.writeFile(bookFile, JSON.stringify(books));
		})
		res.end(JSON.stringify(id));
	};
};
module.exports = author;