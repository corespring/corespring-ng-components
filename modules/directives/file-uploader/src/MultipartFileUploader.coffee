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

class @com.ee.MultipartFileUploader
  constructor: (@file, @binaryData, @url, @name, @options) ->
    now = new Date().getTime()
    boundary = "------multipartformboundary#{now}"

    formBody = @_buildMultipartFormBody @file, @binaryData, boundary
    
    xhr = new XMLHttpRequest()
    xhr.upload.index = 0
    xhr.upload.file = @file
    xhr.upload.downloadStartTime = now;
    xhr.upload.currentStart = now;
    xhr.upload.currentProgress = 0;
    xhr.upload.startData = 0;
    #xhr.upload.addEventListener "progress", ((e) => @_progress e), false
    xhr.open "POST", @url, true

    xhr.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
    xhr.setRequestHeader "Accept", "application/json"
    xhr.sendAsBinary formBody
    
    if @options.onLoadStart? 
      @options.onLoadStart()

    xhr.onload = =>
      if @options.onUploadComplete?
        @options.onUploadComplete xhr.responseText

  _buildMultipartFormBody: (file, fileBinaryData, boundary) ->
    formBuilder = new com.ee.MultipartFormBuilder(boundary)
    params = @options.additionalData
    fileParams = [
      file : file
      data : fileBinaryData
      paramName : @name
    ]
    formBuilder.buildMultipartFormBody params, fileParams, boundary