

// Declare app level module which depends on filters, and services
var aceExampleApp = angular.module('aceExampleApp', ['cs'] );


var MainController = function($scope){

  $scope.dataHolder = { codeText: "<h2>another one</h2>\nhello\nhello\nhello\nhello\n"};
  console.log("MainController::init");

  $scope.codeText = "<h1>hello there</h1>\nwhats\ngoing\non?\here?";

  $scope.exceptions = [{lineNumber: 1}, {lineNumber:2}, {lineNumber:3}];


}