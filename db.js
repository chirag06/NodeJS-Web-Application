var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var myUsername = "****";
var myPassword = "*****";
var myDbname = "db_book_manage";
var myServername = "****.database.windows.net";
// Create connection to database
var config =
{
    authentication: {
        options: {
            userName: myUsername, // update me
            password: myPassword // update me
        },
        type: 'default'
    },
    server: myServername, // update me
    options:
    {
        database: myDbname, //update me
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
}

var connection = new Connection(config);

connection.on('connect', function(err) {
  if(err){
    console.log(err)
  }
});
module.exports = {
  insertData: function (data,rep){
    console.log("insert data",data);
    var obj = data;
    var request = new Request(
      "INSERT INTO BOOKS VALUES ('"+obj['title']+"','"+obj['author']+"',"+obj['year']+",'"+obj['genre']+"');",
      function(err) {
        if(err){
          console.log(err);
        }else{
            queryDatabase(function(datadb){
              rep(datadb);
            });
        }
      }
    );
    request.on('row', function(columns) {

        columns.forEach(function(column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            console.log(column.value);
          }
        });
    });
    connection.execSql(request);
  },
  getData: function(dataAll){
    var data = [];
    var rCount = 0;
    var request = new Request(
      "SELECT * FROM BOOKS",
      function(err, rowCount, rows) {
        rCount = rowCount;
        console.log(rowCount + ' row(s) returned');
        console.log(rows);
        dataAll(data);
      }
    );
    request.on('row', function(row){
    data.push({
      id: row[0].value,
      title: row[1].value,
      author: row[2].value,
      year: row[3].value,
      genre: row[4].value
    });

  });
    connection.execSql(request);
  },
  removeBook: function (id,rep){
    console.log("delete data",id);
    var request = new Request(
      "DELETE FROM BOOKS WHERE BOOKID = "+id+";",
      function(err) {
        if(err){
          console.log(err);
        }else{
            queryDatabase(function(datadb){
              rep(datadb);
            });
        }
      }
    );
    request.on('row', function(columns) {

        columns.forEach(function(column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            console.log(column.value);
          }
        });
    });
    connection.execSql(request);
  },
  getOneBook: function(id, dataAll){
    var data = [];
    var request = new Request(
      "SELECT * FROM BOOKS WHERE BOOKID = "+id+";",
      function(err, rowCount, rows) {
        if(err){
          console.log(err);
        }else{
          console.log(rowCount + ' row(s) returned');
          console.log(data);
          dataAll(data);
        }
      }
    );
    request.on('row', function(row){
    data.push({
      id: row[0].value,
      title: row[1].value,
      author: row[2].value,
      year: row[3].value,
      genre: row[4].value
    });
  });
    connection.execSql(request);
  },
  updateBook: function (data,rep){
    var obj = data;
    console.log("Update data",data);
    var request = new Request(
      "UPDATE BOOKS SET TITLE = '"+obj['title']+"',AUTHOR = '"+obj['author']+"',PUB_YEAR = "+obj['year']+",GENRE = '"+obj['genre']+"' WHERE BOOKID = "+obj['id']+";",
      function(err) {
        if(err){
          console.log(err);
        }else{
            queryDatabase(function(datadb){
              rep(datadb);
            });
        }
      }
    );
    request.on('row', function(columns) {

        columns.forEach(function(column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            console.log(column.value);
          }
        });
    });
    connection.execSql(request);
  },
  searchBook: function(query,dataAll){
    console.log(query + ' is the query');
    var data = [];
    var request = new Request(
      "SELECT * FROM BOOKS WHERE TITLE LIKE '%"+query+"%' OR AUTHOR LIKE '%"+query+"%' OR PUB_YEAR LIKE '%"+query+"%' OR GENRE LIKE '%"+query+"%'",
      function(err, rowCount, rows) {
        rCount = rowCount;
        console.log(rowCount + ' row(s) returned');
        console.log(rows);
        dataAll(data);
      }
    );
    request.on('row', function(row){
    data.push({
      id: row[0].value,
      title: row[1].value,
      author: row[2].value,
      year: row[3].value,
      genre: row[4].value
    });
  });
    connection.execSql(request);
  }
}
function queryDatabase(dataAll) {
  console.log('Reading rows from the Table...');
  var data = [];
  var request = new Request(
    "SELECT * FROM BOOKS",
    function(err, rowCount, rows) {
      console.log(rowCount + ' row(s) returned');
      //process.exit();
      dataAll(data);
    }
  );
  request.on('row', function(row) {
    data.push({
      id: row[0].value,
      title: row[1].value,
      author: row[2].value,
      year: row[3].value,
      genre: row[4].value
    });
  });
  connection.execSql(request);
}
