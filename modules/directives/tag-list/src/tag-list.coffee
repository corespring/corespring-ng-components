
# case insensitive string match 
if !jQuery.expr[':'].matches_ci
  jQuery.expr[':'].matches_ci = (a, i, m) ->
    jQuery(a).text().toUpperCase() == m[3].toUpperCase()


angular.module('cs.directives').directive('tagList', ($timeout) -> 
  definition = 
    replace: false
    template: "<span/>"
    link: (scope, element, attrs) -> 

      selectedTags = null
      availableTags = null

      linkClass = (attrs.tagListLinkClass || "tag-list-link")

      buildTagList = ->

        $(element).html("<span></span>")
        for x in availableTags 
          $link = $("""<a class='#{linkClass}' href='javascript:void(0)'>#{x}</a>""")
          $(element).append( $link )
          $link.click (event) => onTagClick(event)
        null

      applySelectedTags = ->

        $(element).find("." + linkClass).removeClass('selected')

        for selectedTag in selectedTags
          $link = $(element).find("a:matches_ci('"+selectedTag+"')")
          $link.addClass("selected")
        null

      onTagClick = (event) ->
        tagName = $(event.target).text()
        isCurrentlySelected = $(event.target).hasClass("selected")

        scope.$apply ->
          scopeTagArray = scope.$eval(attrs.selectedTags)
          
          if isCurrentlySelected
            index = scopeTagArray.indexOf(tagName)
            scopeTagArray.splice(index, 1)
          else
            scopeTagArray.push(tagName) if scopeTagArray.indexOf(tagName) == -1
        
        #this should be triggered by the watch - but it isn't so triggering manuall here 
        applySelectedTags()
        null

      scope.$watch attrs.selectedTags, (newValue) ->
        selectedTags = newValue
        applySelectedTags() if (availableTags? and selectedTags?)
        null

      scope.$watch attrs.tags, (newValue) -> 
        availableTags = newValue
        buildTagList() if availableTags?
        applySelectedTags() if selectedTags?

        null

      null

  definition
)

