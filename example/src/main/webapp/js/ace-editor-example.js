

// Declare app level module which depends on filters, and services
var aceExampleApp = angular.module('aceExampleApp', ['cs'] );


var MainController = function($scope){

  $scope.dataHolder = { codeText: "<h2>another one</h2>"};
  console.log("MainController::init");

  $scope.codeText = "<h1>hello there</h1>";


}