// Declare app level module which depends on filters, and services
//expanding-tag-list-example.js
angular.module('exampleApp', ['cs'] );

var MainController = function($scope){

  $scope.selectedButtons = [];

  $scope.availableButtons = [
    "One", "Two", "Three"
  ];
};
