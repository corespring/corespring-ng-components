###
infinite scrolling module
Triggers a callback to the scope.
Usage: 
<div when-scrolled="doSomething()"/>
###

###
infinite scrolling module
Triggers a callback to the $scope.
Usage: 
<div when-scrolled="doSomething()" scrolled-mode="div|window(default)"/>
###
angular.module('cs.directives').directive('whenScrolled', -> 
  linkFn = ($scope, $elm, $attrs) -> 
    raw = $elm[0]

    onDivScroll = ->
      rectObject = raw.getBoundingClientRect()
      # if the height is 0 then this element is not visible
      if rectObject.height == 0
        return

      scrollTop = $elm.scrollTop()
      scrolledTotal = $elm.scrollTop() + $elm.innerHeight()

      if scrolledTotal >= raw.scrollHeight
        $scope.$apply($attrs.whenScrolled)
      
      null

    onWindowScroll = -> 
      rectObject = raw.getBoundingClientRect()
      # if the height is 0 then this element is not visible
      if rectObject.height == 0
        return
      if rectObject.bottom <= window.innerHeight
        $scope.$apply($attrs.whenScrolled)
      null
    
    mode = ( $attrs['scrolledMode'] || 'window')

    if mode == "window" 
      angular.element(window).bind('scroll', onWindowScroll)
    else
      $elm.bind('scroll', onDivScroll)

    null
  
  linkFn

)
