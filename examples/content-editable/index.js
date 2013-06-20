angular.module('exampleApp', ['cs'] );

var MainController = function($scope){
  console.log("MainController");

  $scope.someText = "What's going on?";
  $scope.someTextTwo = "Let's get it on";

  $scope.validateChange = function(name, id){
    console.log("validate change: " + name + ", id: " + id);
    return name.indexOf("banana") == -1;
  }
}
