angular.module('cs.services').factory 'Utils', -> 
  definition = 

    ###
    Apply a nested value..
    ###
    applyValue: (obj, property, value) ->
      if !obj?
        throw "Cannot apply to null object the property:  " + property + " with value: " + value 

      if property.indexOf(".") == -1 
        obj[property] = value
      else
        props = property.split(".")
        nextProp = props.shift()
        @applyValue(obj[nextProp], props.join("."), value )
      null


  definition