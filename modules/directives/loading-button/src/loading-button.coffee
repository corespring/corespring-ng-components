###
 * loading-button
 * Simple hookup to twitter button js. 
 * <btn loading-button ngModel="isLoading" data-loading-text="loading..."></btn>
 * dependencies: jQuery and bootstrap.button js
###
angular.module('cs.directives').directive('loadingButton', [ ->
  definition = 
    require: 'ngModel',
    link: (scope,element,attrs) ->
      scope.$watch attrs["ngModel"], (newValue) ->
        command = if newValue then "loading" else "reset"
        $(element).button(command)
  definition  
]);