// Declare app level module which depends on filters, and services
//expanding-tag-list-example.js
var aceExampleApp = angular.module('exampleApp', ['cs'] );

var MainController = function($scope){
  $scope.options = [ {key:"1", value: "1"}];

  $scope.s = {};
  $scope.s.selected = [{
            "key":"PK",
            "value":"Prekindergarten"
        }];

  $scope.getTitle = function(o){
    return o.key;
  };

  $scope.getSelectedTitle = function(items){
    if(items && items.length > 0){
        return items.length + " selected";
    } else {
        return "<i>no items</i>";
    }
  };



  $scope.example = {};

  $scope.example.gradeLevels = [
        {
            "key":"PK",
            "value":"Prekindergarten",
            "selected" : true
        },
        {
            "key":"KG",
            "value":"Kindergarten"
        },
        {
            "key":"01",
            "value":"First grade"
        },
        {
            "key":"02",
            "value":"Second grade"
        },
        {
            "key":"03",
            "value":"Third grade"
        },
        {
            "key":"04",
            "value":"Fourth grade"
        },
        {
            "key":"05",
            "value":"Fifth grade"
        },
        {
            "key":"06",
            "value":"Sixth grade"
        },
        {
            "key":"07",
            "value":"Seventh grade"
        },
        {
            "key":"08",
            "value":"Eighth grade"
        },
        {
            "key":"09",
            "value":"Ninth grade"
        },
        {
            "key":"10",
            "value":"Tenth grade"
        },
        {
            "key":"11",
            "value":"Eleventh grade"
        },
        {
            "key":"12",
            "value":"Twelfth grade"
        },
        {
            "key":"13",
            "value":"Grade 13"
        },
        {
            "key":"PS",
            "value":"Postsecondary"
        },
        {
            "key":"AP",
            "value":"Advanced Placement"
        },
        {
            "key":"UG",
            "value":"Ungraded"
        }
    ]
};
