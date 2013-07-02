angular.module('cs.directives').directive 'jsxGraph', (Canvas) ->
  template: "<div id='box' class='jxgbox' style='width:200px; height:200px;'></div>",
  restrict: 'A',
  scope: 
    boardParams: '=',
    points: '=',
    setPoints: '=',
    maxPoints: '@',
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

      onPointMove = (point, coords) ->
        newCoords = if coords? 
          canvas.interpolateCoords {x: coords.x, y: coords.y}, scope.scale 
        else 
          canvas.interpolateCoords {x: point.X(), y: point.Y()}, scope.scale
        point.moveTo [newCoords.x, newCoords.y]
        scope.points[point.name] = newCoords
        return

      addPoint = (coords) ->
        point = canvas.addPoint coords
        point.on "up", () ->
          onPointMove point
          return
        onPointMove point
        line = canvas.makeLine() if canvas.points.length == 2  
        point

      canvas.on 'up', (e) ->
        coords = canvas.getMouseCoords e, scope.scale
        if (canvas.points.length < scope.maxPoints)
          addPoint coords
        return

      #watch for points change and change points on graph accordingly
      #note: when the points on the graph are moved with the cursor, this is called. resulting in redundant work. it's not
      #to bad though
      scope.$watch 'points', (newValue, oldValue) ->
        if newValue isnt oldValue
          for ptName, pts of scope.points
            coordx = parseFloat pts.x
            coordy = parseFloat pts.y
            if !isNaN(coordx) && !isNaN(coordy)
              coords = {x: coordx, y: coordy}
              canvasPointRef = null;
              for canvasPoint in canvas.points
                if ptName == canvasPoint.name
                  canvasPointRef = canvasPoint
              if canvasPointRef?
                if canvasPointRef.X() isnt coords.x or canvasPointRef.Y() isnt coords.y
                  onPointMove canvasPointRef, coords
              else if (canvas.points.length < scope.maxPoints)
                  addPoint coords
        return
      ,true
    else
      console.error "domain and/or range unspecified"
    return