var db = require('./db');

var express  = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get('/booklist', function(req,res){
    console.log("I received a GET request");
    db.getData(function(allData){
      res.json(allData);
    });
});

app.get('/booklist/:id',function(req,res){
  console.log("Edit landed correctly");
  var id = req.params.id;
  console.log(id);
  db.getOneBook(id,function(doc){
    console.log(doc);
    res.json(doc);
  });
});

app.get('/bookSearch/:query',function(req,res){
  console.log("Search landed correctly");
  var query = req.params.query;
  console.log(query);
  db.searchBook(query,function(doc){
    console.log(doc);
    res.json(doc);
  });
});


app.post('/booklist',function(req,res){
  console.log(req.body);
  db.insertData(req.body,function(doc){
    res.json(doc);
  });
});
app.delete('/booklist/:id',function(req, res) {
  var id = req.params.id;
  console.log(id);
  db.removeBook(id,function(doc){
    console.log("server data"+ doc);
    res.json(doc);
  });
  /*
  db.appointmentlist.remove({_id: mongojs.ObjectID(id)},function(err,doc){
    res.json(doc);
  })*/
});
app.put('/booklist/:id',function(req, res){
  var id = req.params.id;
  console.log("put request "+req.body.author);
  db.updateBook(req.body,function(doc){
    console.log("server data"+ doc);
    res.json(doc);
  });

});
app.listen(3000);
console.log("server running on port) 3000");
