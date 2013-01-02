// Declare app level module which depends on filters, and services
//expanding-tag-list-example.js
var aceExampleApp = angular.module('exampleApp', ['cs'] );

var MainController = function($scope){
  $scope.selected = true;

  $scope.nested = {selected : true};


  $scope.onConfirmed = function(){
    console.log("onConfirmed");
  };

  $scope.onCancelled = function(){
    console.log("onCancelled");
  };
};
