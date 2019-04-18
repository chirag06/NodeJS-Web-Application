function AppCtrl($scope, $http){
  console.log("hello world");
  var refresh = function(){
    $http.get('/bookList').success(function(response) {
      console.log("I got the requested data");
      $scope.bookList = response;
      $scope.book = "";
    });
  };

  refresh();

  $scope.searchBookList = function(){
    console.log($scope.book.searchBook);
    $http.get('/bookSearch/' + $scope.book.searchBook).success(function(response){
      console.log("Searched Data");
      console.log(response);
      $scope.bookList = response;
    });
  };

  $scope.addBookList = function(){
    $http.post('/booklist',$scope.book).success(function(response){
        console.log(response);
        refresh();
    });
  };

  $scope.remove = function(id){
    console.log(id);
    $http.delete('/booklist/' + id).success(function(response){
      refresh();
    });
  };
  $scope.edit = function(id){
    console.log(id);
    $http.get('/booklist/' + id).success(function(response){
      console.log("Edit data");
      console.log(response[0]);
      $scope.book = response[0];
    });
  };
  $scope.update = function(){
    console.log($scope.book.id);
    $http.put('/booklist/' + $scope.book.id, $scope.book).success(function(response){
      refresh();
    })
  };
}
