###
file-uploader - a directive for providing a file upload utility.

Usage:
	<a file-uploader fu-url="/file-upload" fu-name="my-file">add file</a>

Dependencies: JQuery

TODO: Support file drag and drop
###



angular.module('cs.directives').directive('fileUploader', ($rootScope) ->
  definition = 
    replace: false
    link: (scope, element, attrs) ->
      console.log "file upload"


      uploadClick = ->
        console.log "uploadClick"
        element.unbind 'click'
        $(element).find('input').trigger 'click' 

      createFileInput = ->
        #style="width: 1px; height: 1px;" 
        scope.fileInput = """<input 
                type="file" 
                name="#{attrs.fuName}">
         </input>"""
        $(element).append scope.fileInput

        $(element).find('input').change (event) => handleFileSelect event
        null

      handleFileSelect = (event) ->
        files = event.target.files
        file = event.target.files[0]
        reader = new FileReader()
        reader.onloadend = (event) => onLocalFileLoadEnd file, event
        reader.readAsBinaryString file
        null

      ###
      Once the file has been read locally - invoke the Multipart File upload.
      ###
      onLocalFileLoadEnd = (file, event) ->
        if file.size > 100 * 1024
          return
        
        url = attrs.fuUrl
        name = attrs.fuName

        options = 
          onLoadStart : =>
            $rootScope.$broadcast "uploadStarted"
          onUploadComplete : (responseText) =>
            $rootScope.$broadcast "uploadCompleted", responseText

        uploader = new com.ee.MultipartFileUploader file, event.target.result, url, name, options  
        null

      createFileInput()
      element.bind 'click', uploadClick
      null

  definition

)