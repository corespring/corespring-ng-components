angular.module('cs.services').factory 'Canvas', () ->
  class Canvas
    constructor: (@board) -> 
      @points = []

    #given mouse clicke event e, get the coordinates on the board that was clicked
    getMouseCoords: (e) ->
      new JXG.Coords JXG.COORDS_BY_SCREEN, [e.offsetX, e.offsetY], @board
	
    #if there is a collision, return the point that coords collides with
    #otherwise return undefined
    pointCollision: (coords) ->
      for el in @board.objects
        if JXG.isPoint(@board.objects[el]) and @board.objects[el].hasPoint coords.scrCoords[1], coords.scrCoords[2]
          return el
        else
          return null
	
    #add a point to the board, update the points array
    addPoint: (coords) ->
      point = @board.create 'point', [coords.usrCoords[1], coords.usrCoords[2]]
      @points.push point
      point
    
    #remove the last point
    popPoint: () ->
      @board.removeObject @points.pop

    removePoint: (pointId) ->
      @board.removeObject pointId
      @points = p for p in @points when p.id != pointId

    on: (event,handler) ->
      @board.on event, handler

    makeLine: () ->
      @board.create('line', [@points[0], @points[1]], {strokeColor:'#00ff00', strokeWidth:2, fixed:true}) if @points.length == 2

    prettifyPoints: () ->
      newPoints = {}
      for p in @points
        newPoints[p.name] = {x: p.coords.usrCoords[1], y: p.coords.usrCoords[2]} 
      newPoints

    interpolatePoint: (p, scale) ->
      interpolate = (num) ->
        Math.round(num/scale) * scale
      p.moveTo [interpolate(p.X()), interpolate(p.Y())]
  Canvas