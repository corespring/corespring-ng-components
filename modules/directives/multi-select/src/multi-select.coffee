###
Creates a dropdown with checkboxes so you can select multiple items.
params:
  @multi-get-title - the function for rendering a title for an individual item
  @multi-get-selected-title - a function that returns the html for the selection,
    function( items -the selected items){ return -a html string } 
  @multi-get-options - the data provider for the possible options
  @multi-change - a callback when anything changes
  @multi-uid - a property that uniquely indentifies the object within the array of options
  @multi-model - the model to update with the selection
usage: 
  <span multi-select
              multi-get-selected-title="getCollectionSelectedTitle"
              multi-options="collections"
              multi-change="search"
              multi-uid="name"
              multi-model="searchParams.collection">
            </span>
###
angular.module('cs.directives').directive('multiSelect', ($timeout) -> 

  template = """<span class="multi-select">
                   <div 
                     class="items" 
                     ng-click="showChooser=!showChooser"
                     ng-bind-html-unsafe="multiGetSelectedTitle(selected)">
                   </div>
                   <div class="chooser" ng-show="showChooser">
                    <ul>
                      <li ng-repeat="o in options" >
                        <input type="checkbox" ng-model="selectedArr[o.${uidKey}]" ng-click="toggleItem(o)"></input>
                        {{multiGetTitle(o)}}
                      </li>
                    </ul>
                   </div>
                 </span>"""


  ###
  Linking function
  ###
  link = (scope, element, attrs) ->
    optionsProp = attrs['multiOptions']
    uidKey = (attrs['multiUid'] || "key")
    modelProp = attrs['multiModel']
    getTitleProp = attrs['multiGetTitle']
    getSelectedTitleProp = attrs['multiGetSelectedTitle']
    changeCallback = attrs['multiChange']
    scope.noneSelected = "None selected"
    scope.showChooser = false

    scope.$watch optionsProp, (newValue) ->
      scope.options = newValue 
      updateSelection() 
      null

    scope.$watch modelProp, (newValue) ->
      scope.selected = newValue 
      updateSelection() 
      null

    updateSelection = ->
      if !scope.selected?
        return null

      scope.selectedArr = {} 
      for x in scope.selected
        if x[uidKey] 
          scope.selectedArr[x[uidKey]] = true 

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

  ###
  Fix up the template to use the uid key for the ng-model.
  ###
  compile = (element,attrs,transclude) ->
    uidKey = (attrs['multiUid'] || "key")
    prepped = template.replace("${uidKey}", uidKey)
    element.html(prepped)
    link 
  
  definition = 
    restrict: 'A',
    compile: compile,
    scope: 'isolate',

  definition
)

