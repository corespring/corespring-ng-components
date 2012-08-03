//expanding-tag-list-example.js



// Declare app level module which depends on filters, and services
//expanding-tag-list-example.js
var aceExampleApp = angular.module('tagListExampleApp', ['cs'] );

var MainController = function($scope){

  $scope.availableTags = ['Arrange', 'Define', 'Describe', 'Duplicate', 'Identify', 'Label', 'List', 'Match', 'Memonze', 'Name', 'Order', 'Outline', 'Recognize', 'Relate', 'Recall', 'Repeat', 'Reproduce', 'Select', 'State'];

  $scope.selectedTags = ['Arrange'];

  $scope.understand = {
    tags: ['Classify', 'Convert', 'Defend', 'Descrbe', 'Discuss', 'Distinguish', 'Estimate', 'Explain', 'Express', 'Extend', 'Generalize', 'Give', 'Example(s)', 'Identify', 'Indicate', 'Infer', 'Locate', 'Paraphrase', 'Predict', 'Recognize', 'Rewrite', 'Review', 'Select', 'Summarize', 'Translate'],
    selectedTags: ['Convert']

  };

}
/*
'Knowledge', 'Arrange', 'Define', 'Describe', 'Duplicate', 'Identify', 'Label', 'List', 'Match', 'Memonze', 'Name', 'Order', 'Outline', 'Recognize', 'Relate', 'Recall', 'Repeat', 'Reproduce', 'Select', 'State', 

'Understand', 'Classify', 'Convert', 'Defend', 'Descrbe', 'Discuss', 'Distinguish', 'Estimate', 'Explain', 'Express', 'Extend', 'Generalize', 'Give', 'Example(s)', 'Identify', 'Indicate', 'Infer', 'Locate', 'Paraphrase', 'Predict', 'Recognize', 'Rewrite', 'Review', 'Select', 'Summarize', 'Translate', 

'Apply', 'Apply', 'Change', 'Choose', 'Compute', 'Demonstrate', 'Discover', 'Dramatize', 'Employ', 'Illustrate', 'Interpret', 'Manipulate', 'Modify', 'Operate', 'Practice', 'Predict', 'Prepare', 'Produce', 'Relate', 'Schedule', 'Show', 'Sketch', 'Solve', 'Use', 'Write', 

'Analyse', 'Andyze', 'Appraise', 'Breakdown', 'Calculate', 'Categorize', 'Compare', 'Contrast', 'Criticize', 'Diagram', 'Differentiate', 'Discriminate', 'Distinguish', 'Examine', 'Experiment', 'Identify', 'Illustrate', 'Infer', 'Model', 'Outline', 'Point-Out', 'Question', 'Relate', 'Select', 'Separate', 'Test', 

'Evaluate', 'Arrange', 'Assernble', 'Categorize', 'Collect', 'Combine', 'Comply', 'Compose', 'Construct', 'Create', 'Design', 'Develop', 'Devise', 'Explain', 'Formulate', 'Generate', 'Plan', 'Prepare', 'Rearrange'
*/



/**

Knowledge Arrange Define Describe Duplicate Identify Label List Match Memonze Name Order Outline Recognize Relate Recall Repeat Reproduce Select State Understand Classify Convert Defend Descrbe Discuss Distinguish Estimate Explain Express Extend Generalize Give Example(s) Identify Indicate Infer Locate Paraphrase Predict Recognize Rewrite Review Select Summarize Translate Apply Apply Change Choose Compute Demonstrate Discover Dramatize Employ Illustrate Interpret Manipulate Modify Operate Practice Predict Prepare Produce Relate Schedule Show Sketch Solve Use Write Analyse Andyze Appraise Breakdown Calculate Categorize Compare Contrast Criticize Diagram Differentiate Discriminate Distinguish Examine Experiment Identify Illustrate Infer Model Outline Point-Out Question Relate Select Separate Test Evaluate Arrange Assernble Categorize Collect Combine Comply Compose Construct Create Design Develop Devise Explain Formulate Generate Plan Prepare Rearrange 


*/