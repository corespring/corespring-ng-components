angular.module('cs.directives').directive('multiSelect', ($timeout) -> 
  definition = 
    replace: true
    restrict: 'A',
    scope: 'isolate',
    template: """<span class="multi-select">
                   <div 
                     class="items" 
                     ng-click="showChooser=!showChooser"
                     ng-bind-html-unsafe="multiGetSelectedTitle(selected)">
                   </div>
                   <div class="chooser" ng-show="showChooser">
                    <ul>
                      <li ng-repeat="o in options" >
                        <input type="checkbox" ng-click="toggleItem(o)"></input>
                        {{multiGetTitle(o)}}
                      </li>
                    </ul>
                   </div>
                 </span>"""

    link: (scope, element, attrs) -> 

      optionsProp = attrs['multiOptions']
      modelProp = attrs['multiModel']
      getTitleProp = attrs['multiGetTitle']
      getSelectedTitleProp = attrs['multiGetSelectedTitle']
      changeCallback = attrs['multiChange']
      scope.noneSelected = "None selected"
      scope.showChooser = false

      scope.$watch optionsProp, (newValue) ->
        scope.options = newValue 
        null

      scope.$watch modelProp, (newValue) ->
        scope.selected = newValue  
        null

      ###
      Apply a nested value..
      ###
      applyValue = (obj, property, value) ->
        if !obj?
          throw "Cannot apply to null object the property:  " + property + " with value: " + value 

        if property.indexOf(".") == -1 
          obj[property] = value
        else
          props = property.split(".")
          nextProp = props.shift()
          applyValue(obj[nextProp], props.join("."), value )
        null

      ###
      Need to use $eval to support nested values
      ###
      scope.toggleItem = (i) ->
        
        if !scope.$eval(modelProp)?
          applyValue(scope, modelProp, []) 
        
        arr = scope.$eval(modelProp)
        index = arr.indexOf(i)
        optionIndex = scope.$eval(optionsProp).indexOf(i)
        
        if index == -1
          arr.push(i)
        else
          arr.splice(index, 1)

        sortFn = (a,b) ->
          aIndex = scope.$eval(optionsProp).indexOf(a)
          bIndex = scope.$eval(optionsProp).indexOf(b)
          aIndex - bIndex

        applyValue scope, modelProp, arr.sort(sortFn)
        scope[changeCallback]() if changeCallback?
        null

      scope.multiGetSelectedTitle = (items) ->
        scope[getSelectedTitleProp](items)

      scope.multiGetTitle = (t) -> 
        scope[getTitleProp](t)
      null

  definition
)

