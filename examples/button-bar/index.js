// Declare app level module which depends on filters, and services
//expanding-tag-list-example.js
angular.module('exampleApp', ['cs'] );

var MainController = function($scope){

  $scope.selectedButtons = [];

  $scope.one = {
    available: [
    "One", "Two", "Three"
  ],
  selected: []
  };


  $scope.two = {

    selected: [ "1", "2"], 
    available: ["1", "2", "3"]
  };

  $scope.three = {
    selected: ["key-1"],
    available: [ 
    {key : 'key-1', value: "v-1"}]
  };
};
