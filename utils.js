var util = function(){
	var self = this;

	var fs = require("fs");

	self.readFile = function(file,callback){
		fs.readFile(file,function (err,data){
			callback(data);
		});
	}

	self.findById = function(file,id,callback){
		self.readFile(file,function(data){
			objs = JSON.parse(data);
			var obj = objs.find(function(obj){
				return obj.id == id;
			})
			callback(obj);
		})
	}

	self.deleteElemById = function(file,id,callback){
		self.readFile(file,function(objFile){
			deleteElement(JSON.parse(objFile),id,callback) 
		})
	}
	function deleteElement(objs,id,callback){
		objs.forEach(function(obj,index){
			if ( id == obj.id){
				objs.splice(index,1);
			}
		})
		callback(objs);
	}
};
module.exports = util;