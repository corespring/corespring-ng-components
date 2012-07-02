###
infinite scrolling module
Triggers a callback to the scope.
Usage: 
<div when-scrolled="doSomething()"/>
###
angular.module('cs.directives').directive('whenScrolled', -> 
  fn = (scope, elm, attr) -> 
    raw = elm[0]

    funCheckBounds = -> 
      rectObject = raw.getBoundingClientRect()
      # if the height is 0 then this element is not visible
      if rectObject.height == 0
        return
      if rectObject.bottom <= window.innerHeight
        scope.$apply(attr.whenScrolled)
      null
      
    angular.element(window).bind('scroll', funCheckBounds)
  fn
)