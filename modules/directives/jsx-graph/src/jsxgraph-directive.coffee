angular.module('cs.directives').directive 'jsxGraph', (Canvas) ->
  template: "<div id='box' class='jxgbox' style='width:200px; height:200px;'></div>",
  restrict: 'A',
  scope: 
    boardParams: '=',
    pointsCallback: '=',
    maxPoints: '@',
    mousePtr: '=',
    scale: '@'
  link: (scope,elem,attr) ->
    domain = scope.boardParams.domain
    range = scope.boardParams.range
    if domain and range
      canvas = new Canvas JXG.JSXGraph.initBoard 'box',
            boundingbox: [(0 - domain), range, domain, (0 - range)],
            grid: true,
            axis: true,
            showNavigation: false,
            showCopyright: false
      canvas.on 'up', (e) ->
        coords = canvas.getMouseCoords e
        pointCollision = canvas.pointCollision coords
        if !pointCollision? and (canvas.points.length < scope.maxPoints)
          point = canvas.addPoint coords
          point.on "up", () ->
            canvas.interpolatePoint point, scope.scale
            scope.pointsCallback canvas.prettifyPoints()
            return
          canvas.interpolatePoint point, scope.scale
          scope.pointsCallback canvas.prettifyPoints()
          line = canvas.makeLine() if canvas.points.length == 2
        return
      canvas.on "move", (e) ->
        coords = canvas.getMouseCoords e
        scope.mousePtr = 
          x: coords.usrCoords[1],
          y: coords.usrCoords[2]
        return
    else
      console.error "domain and/or range unspecified"