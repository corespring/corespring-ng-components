#
# A simple button bar
# Eg: <button-bar ng-model="selected" button-provider="buttons" key="label"/>
#
# @ngModel = the chosen items
# @buttonProvider an array of choices
# @key - the property of the buttonProvider objects to use for display, and to store in the ngModel
#
angular.module('cs.directives')
  .directive('buttonBar', [ '$log', ($log) ->

    link = ($scope, $element, $attr) -> 
      $scope.selected = (b) ->
        dataValue = $scope.getValue(b) 
        $scope.ngModel and $scope.ngModel.indexOf(dataValue) != -1

      $scope.toggle = (b) -> 
        $scope.ngModel = $scope.ngModel || []
        dataValue = $scope.getValue(b)
        index = $scope.ngModel.indexOf(dataValue)
        if index == -1
          $scope.ngModel.push(dataValue)
        else
          $scope.ngModel.splice(index, 1)

      $scope.getValue = (b) ->
        if $scope.key?
          b[$scope.key]
        else 
          b


    out = 
      restrict: 'E'
      link: link
      replace: true
      scope: 
        buttonProvider: '='
        ngModel: '='
        key: '@'
      template: """
      <div class="btn-group btn-group-justified">
        <div class="btn-group"
            ng-repeat="b in buttonProvider" 
            >
          <button 
            type="button" 
            ng-click="toggle(b)"
            onmouseout="this.blur()"
            ng-class="{ active: selected(b)}"
            class="btn btn-default">{{getValue(b)}}</button>
          </div>
      </div>
      """
    out
])
