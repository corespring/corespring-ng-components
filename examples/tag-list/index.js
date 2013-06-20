angular.module('exampleApp', ['cs'] );

var MainController = function($scope){

  $scope.availableTags = ['Arrange', 'Define', 'Describe', 'Duplicate', 'Identify', 'Label', 'List', 'Match', 'Memonze', 'Name', 'Order', 'Outline', 'Recognize', 'Relate', 'Recall', 'Repeat', 'Reproduce', 'Select', 'State'];

  $scope.selectedTags = ['Arrange'];

  $scope.understand = {
    tags: ['Classify', 'Convert', 'Defend', 'Descrbe', 'Discuss', 'Distinguish', 'Estimate', 'Explain', 'Express', 'Extend', 'Generalize', 'Give', 'Example(s)', 'Identify', 'Indicate', 'Infer', 'Locate', 'Paraphrase', 'Predict', 'Recognize', 'Rewrite', 'Review', 'Select', 'Summarize', 'Translate'],
    selectedTags: ['Convert']

  };

}
