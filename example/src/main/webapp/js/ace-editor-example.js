

// Declare app level module which depends on filters, and services
var aceExampleApp = angular.module('aceExampleApp', ['cs'] );


var MainController = function($scope){

  console.log("MainController::init");

  $scope.codeText = "<root><node name='banana'></root>";


}