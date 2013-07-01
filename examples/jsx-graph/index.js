angular.module('exampleApp', ['cs'] );

var MainController = function($scope,$timeout){
	$scope.boardParams = {
		domain: 10,
		range: 10
	}
	$scope.equation = "y = mx + b";
	$scope.points = {A: {x: "", y: ""}, B: {x: "", y: ""}}
	$scope.$watch('points', function(points){
		console.log(JSON.stringify($scope.points));
		if(points.length == 2){
			var slope = (points[0].y - points[1].y) / (points[0].x - points[1].x)
			var yintercept = points[0].y - (points[0].x * slope)
			$scope.equation = "y = "+slope+"x + "+yintercept;
		}
	})
	//refresh periodically
	$timeout(redraw, 500)
	function redraw(){
		$scope.$digest()
		$timeout(redraw, 500)
	}
};