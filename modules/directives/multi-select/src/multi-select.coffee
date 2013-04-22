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


angular.module('cs.directives').directive('multiSelect', ['$timeout', 'Utils', ($timeout, Utils) -> 

  template = """<span class="multi-select">
                  ${summaryHtml}
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
    changeCallback = attrs['multiChange']
    scope.noneSelected = "None selected"
    scope.showChooser = false

    scope.$watch optionsProp, (newValue) ->
      scope.options = newValue 
      updateSelection() 
      null

    scope.$watch modelProp, (newValue) ->
      if newValue?
        scope.selected = newValue 
      else
        scope.selected = []
        
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
    Need to use $eval to support nested values
    ###
    scope.toggleItem = (i) ->

      getIndexById = (arr, item) ->
        for arrItem, index in arr 
          if arrItem[uidKey] and arrItem[uidKey] == item[uidKey]
            return index 
        -1

      if !scope.$eval(modelProp)?
        Utils.applyValue(scope, modelProp, []) 
      
      arr = scope.$eval(modelProp)
      index = getIndexById(arr,i)
      optionIndex = scope.$eval(optionsProp).indexOf(i)
      
      if index == -1
        arr.push(i)
      else
        arr.splice(index, 1)

      sortFn = (a,b) ->
        aIndex = scope.$eval(optionsProp).indexOf(a)
        bIndex = scope.$eval(optionsProp).indexOf(b)
        aIndex - bIndex

      Utils.applyValue scope, modelProp, arr.sort(sortFn)
      scope[changeCallback]() if changeCallback?
      null

    scope.multiGetTitle = (t) -> 
      scope[getTitleProp](t)
    null

  ###
  Fix up the template to use the uid key for the ng-model.
  ###
  compile = (element,attrs,transclude) ->
    uidKey = (attrs['multiUid'] || "key")
    outer = null
    element.find(".summary").each ->
      outer = $(@).clone().wrap('<p>').parent().html()
    summaryHtml = outer

    if !summaryHtml?
      throw "You need to add a summary node to the multi-select: eg: <div id='summary'>...</div>"
    summaryHtml = summaryHtml.replace /(<.*?)(>)/, "$1 ng-click='showChooser=!showChooser' $2"
    prepped = template
      .replace("${uidKey}", uidKey)
      .replace("${summaryHtml}", summaryHtml)

    element.html(prepped)
    link 
  
  definition = 
    restrict: 'A',
    compile: compile,
    scope: 'isolate',

  definition
])

