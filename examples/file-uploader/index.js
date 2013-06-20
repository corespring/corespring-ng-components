angular.module('exampleApp', ['cs'] );

var MainController = function($scope){
  console.log("MainController::init");

  $scope.$on( "uploadCompleted", function(event, result){
    console.log("controller: uploadCompleted");
    $scope.$apply( function(){
      $scope.imageUrl = $.parseJSON( result ).url;
    })
  });

  $scope.$on( "uploadStarted", function(event){
    console.log("controller: uploadStarted");
  });
}