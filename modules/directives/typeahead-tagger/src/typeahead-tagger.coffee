#typeahead-tagger.coffee

###

###

angular.module('cs.directives').directive('typeahead', ($timeout) -> 
  definition = 
    replace: true
    template: """<input type="text" data-items="4"></input>"""
    link: (scope, element, attrs) -> 

      tagsModel = attrs['ttTagsModel']

      addTag = (item)->
        scope.$apply ->
          scope[tagsModel] = [] if !scope[tagsModel]?
          scope[tagsModel].push(item)
          console.log "tags count: #{scope[tagsModel]}"

      onItemSelect = (item) ->
        addTag(item)

      console.log "typeaheadTagger is here!!!!"

      options = 
        source: scope[attrs['ttQuerySource']]
        onselect: onItemSelect
        property: attrs['ttProperty']

      #onInputChange

      $(element).find('input').typeahead(options)
  definition
)

