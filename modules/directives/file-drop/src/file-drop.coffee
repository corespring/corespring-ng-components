angular.module('cs.directives').directive('fileDrop', ($rootScope) ->
  definition =
    link: ($scope,$element,$attrs) ->

      getClassNames = (e) -> e.attr('class').split(/\s+/);

      callback = $scope[$attrs['onFileDropped']]

      originalClasses = getClassNames($element)


      acceptedFileTypes = $attrs['fileTypes'].split(",")

      dropbox = $element[0]

      acceptedType = (file) ->
        for t in acceptedFileTypes
          if( file.type.indexOf(t) != -1)
            return true
        false

      dragFn = (className, fn) ->
        (evt) ->
          console.log "drag enter leave"
          $element.attr('class', originalClasses.join(" "))
          $element.addClass(className) if className?
          evt.stopPropagation()
          evt.preventDefault()
          fn(evt) if fn?
          null

      #dragEnter = dragFn("over")

      dragLeave = dragFn()

      dragOver = dragFn("over")

      dropBody = (evt) ->
        console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
        files = evt.dataTransfer.files
        if (files.length == 1 and acceptedType(files[0]))
          console.log files
          callback(files[0]) if callback?
        null

      drop =  dragFn("", dropBody )

      #dropbox.addEventListener("dragenter", dragEnter, false)
      dropbox.addEventListener("dragleave", dragLeave, false)
      dropbox.addEventListener("dragover", dragOver, false)
      dropbox.addEventListener("drop", drop, false)

  definition
)
