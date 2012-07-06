###
Taken from: 
https://github.com/edeustace/inplace-image-changer
###

if !XMLHttpRequest.prototype.sendAsBinary
  XMLHttpRequest.prototype.sendAsBinary = (dataStr)->
    byteValue = (x)->
      x.charCodeAt(0) & 0xff

    ords = Array.prototype.map.call dataStr, byteValue
    ui8a = new Uint8Array ords
    @send ui8a.buffer
    null

window.com || (window.com = {})
com.ee || (com.ee = {})


###
Simplifies the xhr upload api
###
class @com.ee.XHRWrapper

  constructor: (@file, @formBody, @url, @name, @options) ->
    formBody = @binaryData
    now = new Date().getTime()
    @request = new XMLHttpRequest()
    @request.upload.index = 0
    @request.upload.file = @file
    @request.upload.downloadStartTime = now;
    @request.upload.currentStart = now;
    @request.upload.currentProgress = 0;
    @request.upload.startData = 0;
    #@request.upload.addEventListener "progress", ((e) => @_progress e), false
    @request.open "POST", @url, true

    #@request.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
    @request.setRequestHeader "Accept", "application/json"
    #@request.sendAsBinary formBody
    
    if @options.onLoadStart? 
      @options.onLoadStart()

    @request.onload = =>
      if @options.onUploadComplete?
        @options.onUploadComplete @request.responseText

  setRequestHeader: (name, value) ->
    @request.setRequestHeader name, value
    null

  beginUpload: ->
    @request.sendAsBinary @formBody
    null

###
Place the binary data directly into the request body.
###
class @com.ee.RawFileUploader
  constructor: (@file, @binaryData, @url, @name, @options) ->
    @xhr = new com.ee.XHRWrapper(@file, @binaryData, @url, @name, @options )
    #@xhr.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
    @xhr.setRequestHeader "Accept", "application/json"
  
  beginUpload: -> @xhr.beginUpload() 


###
Build up a multipart form data request body
###
class @com.ee.MultipartFileUploader
  constructor: (@file, @binaryData, @url, @name, @options) ->
    uid = Math.floor( Math.random() * 100000 )
    boundary = "------multipartformboundary#{uid}"

    formBody = @_buildMultipartFormBody @file, @binaryData, boundary
    @xhr = new com.ee.XHRWrapper(@file, formBody, @url, @name, @options )
    @xhr.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
    @xhr.setRequestHeader "Accept", "application/json"

  beginUpload: -> @xhr.beginUpload()
    
  _buildMultipartFormBody: (file, fileBinaryData, boundary) ->
    formBuilder = new com.ee.MultipartFormBuilder(boundary)
    params = @options.additionalData
    fileParams = [
      file : file
      data : fileBinaryData
      paramName : @name
    ]
    formBuilder.buildMultipartFormBody params, fileParams, boundary