###
file-uploader - a directive for providing a file upload utility.

Usage:
	<a file-uploader fu-url="/file-upload" fu-name="my-file">add file</a>

  @params
    fu-url (string or name of function on scope)
    fu-name (the item name [only relevant for multipart upload])
    fu-mode (raw|multipart [default: multipart]) 
      raw places the data directly into the content body
      multipart create the 'content flags' eg:  'content-disposition', 'boundary'
    fu-max-size the max size in kB that a user can upload (default: 200)

Events:
  "uploadStarted"  (event) ->  : fired when uploading has started
  "uploadCompleted" (event, serverResponse)-> : fired when uploading is completed

Dependencies: JQuery

TODO: Support file drag and drop
###

angular.module('cs.directives').directive('fileUploader', ($rootScope) ->
  definition = 
    replace: false
    link: (scope, element, attrs) ->

      mode = "multipart"
      mode = "raw" if attrs.fuMode == "raw"

      maxSizeKb = ( parseInt(attrs.fuMaxSize) || 200 )
      maxSize = maxSizeKb * 1024

      fuUid = "file_upload_input_#{Math.round( Math.random() * 10000 )}"
      $fuHiddenInput = null

      uploadClick = -> $fuHiddenInput.trigger 'click'

      createFileInput = ->

        styleDef = "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; visibility: hidden; padding: 0px; margin: 0px; line-height: 0px;" 
        scope.fileInput = """<input 
                type="file" 
                id="#{fuUid}"
                style="#{styleDef}" 
                name="#{attrs.fuName}">
         </input>"""
        $(element).parent().append scope.fileInput
        $fuHiddenInput = $(element).parent().find("##{fuUid}")
        $fuHiddenInput.change (event) => handleFileSelect event
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
        if file.size > maxSize
          $rootScope.$broadcast "fileSizeGreaterThanMax", file, maxSizeKb
          return
     
        # default to a static url 
        url = attrs.fuUrl

        # if the url is a function on the scope execute the function what has the 
        # signature: (file) => String
        if attrs.fuUrl.indexOf("()") != -1 
          callback = attrs.fuUrl.replace("(", "").replace(")", "")
          if typeof(scope[callback]) == "function"
            url = scope[callback](file)

        name = attrs.fuName

        options = 
          onLoadStart : =>
            $rootScope.$broadcast "uploadStarted"
          onUploadComplete : (responseText) =>
            $rootScope.$broadcast "uploadCompleted", responseText

        if mode == "raw"
          uploader = new com.ee.RawFileUploader file, event.target.result, url, name, options
        else
          uploader = new com.ee.MultipartFileUploader file, event.target.result, url, name, options  

        uploader.beginUpload()

        null

      createFileInput()
      element.bind 'click', uploadClick
      null

  definition

)