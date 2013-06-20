angular.module('exampleApp', ['cs'] );

var MainController = function($scope){
  console.log("MainController");

  $scope.someText = "What's going on?";
  $scope.someTextTwo = "Let's get it on";

  $scope.idOne = "_id_one";

  $scope.validateChange = function(name, id, callback){
    console.log("validate change: " + name + ", id: " + id);
    var containsBanana = name.indexOf("banana") != -1;
    callback(!containsBanana);
  }
}
