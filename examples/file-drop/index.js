// Declare app level module which depends on filters, and services
angular.module('exampleApp', ['cs']);

var MainController = function($scope) {
  console.log("MainController::init");

  $scope.onLocalFileDropped = function(file) {
    console.log("onLocalFileDropped");
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log("result: " + event.target.result);
    };
    reader.readAsText(file);
  };
};