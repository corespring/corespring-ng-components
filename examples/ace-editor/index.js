angular.module('exampleApp', ['cs'] );

var MainController = function($scope){

  $scope.dataHolder = { codeText: "<h2>another one</h2>\nhello\nhello\nhello\nhello\n"};
  console.log("MainController::init");

  $scope.codeText = "<h1>hello there</h1>\nwhats\ngoing\non?\here?";

  $scope.$watch('codeText', function(newValue){
    console.log("changed: " + newValue);
  })

  $scope.exceptions = [{lineNumber: 1}, {lineNumber:2}, {lineNumber:3}];

}