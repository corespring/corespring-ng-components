// Declare app level module which depends on filters, and services
var aceExampleApp = angular.module('typeAheadTaggerExampleApp', ['cs'] );


var MainController = function($scope){

  console.log("MainController::init");


    $scope.tags = [];


    $scope.lookupSubject = function (typeahead, query) {

      console.log(query);
       
      typeahead.process([{name: "Ed"}, { name: "Joe"}]);
    }

      $scope.onItemSelect = function (item) {
                console.log("onItemSelect..." + item);
                $scope.addTag(item);
            };


    

     
}