###
  Confirm popup. depends on angular-ui + bootstrap

  Usage: 
    <div confirm-popup ng-model="selected"
      confirmed="onConfirmed" cancelled="onCancelled">
    <h2>remove?</h2>
    <p>Are you sure?</p>
    <button id="confirm">Yes</button>
    <button id="cancel">No</button>
  </div>
###

angular.module('cs.directives').directive('confirmPopup', ['$timeout', 'Utils', ($timeout, Utils) ->

  link = (scope, elm, attrs, model) ->

    elm.addClass('modal hide')

    elm.find("#confirm").click ->
      elm.modal 'hide'
      scope[attrs.confirmed]() if scope[attrs.confirmed]? 
      null

    elm.find("#cancel").click ->
      scope.$apply ->
        Utils.applyValue scope, attrs.ngModel, scope.stashedValue
        null

      scope.stashedValue = null
      elm.modal 'hide'
      scope[attrs.cancelled]() if scope[attrs.cancelled]? 
      null

    scope.$watch attrs.ngModel, (newValue, oldValue) ->
      if oldValue == true and newValue == false
        scope.stashedValue = oldValue
        elm.modal {show: true } 
      if !newValue? and oldValue?
        scope.stashedValue = oldValue
        elm.modal {show: true} 


    elm.on 'shown', -> 
      elm.find( "[autofocus]" ).focus()

    null
    
  definition = 
    require: 'ngModel'
    link: link

  definition
])