angular.module('cs.directives')
  .directive('buttonBar', [ '$log', ($log) ->

    link = ($scope, $element, $attr) -> 
      $scope.selected = (b) -> 
        $scope.ngModel and $scope.ngModel.indexOf(b) != -1

      $scope.toggle = (b) -> 
        $scope.ngModel = $scope.ngModel || []
        index = $scope.ngModel.indexOf(b)
        if index == -1
          $scope.ngModel.push(b)
        else
          $scope.ngModel.splice(index, 1)

    out = 
      restrict: 'E'
      link: link
      scope: 
        buttonProvider: '='
        ngModel: '='
      template: """
      <div class="btn-group">
        <button 
          ng-repeat="b in buttonProvider" 
          type="button" 
          ng-click="toggle(b)"
          onmouseout="this.blur()"
          ng-class="{ active: selected(b)}"
          class="btn btn-default">{{b}}</button>
      </div>
      """
    out
])
